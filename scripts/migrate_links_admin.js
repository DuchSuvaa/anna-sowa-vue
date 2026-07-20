import admin from 'firebase-admin';
import fs from 'fs';
import xml2js from 'xml2js';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function normalize(str) {
  return str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

async function run() {
  console.log("Parsing XML...");
  const xml = fs.readFileSync('./annasowa.WordPress.2026-03-09.xml', 'utf8');
  
  xml2js.parseString(xml, async (err, result) => {
    if (err) {
      console.error("Failed to parse XML:", err);
      process.exit(1);
    }
    
    const items = result.rss.channel[0].item;
    const newsLinks = [];
    
    for (const item of items) {
      const postType = item['wp:post_type'] ? item['wp:post_type'][0] : '';
      if (postType !== 'news_item') continue;
      
      let link = null;
      let dateStr = '';
      
      const meta = item['wp:postmeta'] || [];
      for (const m of meta) {
        if (m['wp:meta_key'][0] === 'news_link') {
          link = m['wp:meta_value'][0];
        }
        if (m['wp:meta_key'][0] === 'news_date') {
          dateStr = m['wp:meta_value'][0];
        }
      }
      
      if (link && link.trim() !== '') {
        newsLinks.push({
          title: item.title[0],
          link: link.trim(),
          dateStr: dateStr
        });
      }
    }
    
    console.log(`Extracted ${newsLinks.length} links with dates from XML.`);
    const availableLinks = newsLinks.map(nl => ({ ...nl, used: false }));
    
    console.log("Fetching news from Firebase...");
    const querySnapshot = await db.collection("news").get();
    
    let batch = db.batch();
    let count = 0;
    let clearCount = 0;
    
    for (const document of querySnapshot.docs) {
      const item = { id: document.id, ...document.data() };
      let fbTitle = item.title || (item.description && item.description.en) || '';
      let normFb = normalize(fbTitle);
      
      if (normFb.length < 3) continue;

      let matchIndex = availableLinks.findIndex(nl => {
        if (nl.used || normalize(nl.title) !== normFb) return false;
        if (!nl.dateStr || !item.time?.en) return true;
        
        let fbYear = item.time.en.match(/\d{4}/);
        let nlYear = nl.dateStr.match(/\d{4}/);
        if (fbYear && nlYear && fbYear[0] === nlYear[0]) return true;
        
        let fbTimeNorm = normalize(item.time.en);
        let nlTimeNorm = normalize(nl.dateStr);
        return fbTimeNorm.includes(nlTimeNorm) || nlTimeNorm.includes(fbTimeNorm) || nlTimeNorm === fbTimeNorm;
      });
      
      if (matchIndex === -1) {
        matchIndex = availableLinks.findIndex(nl => !nl.used && normalize(nl.title) === normFb);
      }
      
      if (matchIndex === -1 && normFb.length > 5) {
        matchIndex = availableLinks.findIndex(nl => {
          let n = normalize(nl.title);
          return !nl.used && n.length > 5 && (normFb.includes(n) || n.includes(normFb));
        });
      }
      
      if (matchIndex !== -1) {
        const match = availableLinks[matchIndex];
        availableLinks[matchIndex].used = true;
        
        if (item.link !== match.link) {
          batch.update(db.collection('news').doc(item.id), { link: match.link });
          count++;
        }
      } else if (item.link) {
        const isFromXml = newsLinks.some(nl => nl.link === item.link);
        if (isFromXml) {
          batch.update(db.collection('news').doc(item.id), { link: admin.firestore.FieldValue.delete() });
          clearCount++;
        }
      }
    }
    
    console.log(`Committing batch: ${count} updates, ${clearCount} removals...`);
    if (count > 0 || clearCount > 0) {
      await batch.commit();
      console.log(`Migration complete! Corrected ${count} links. Cleared ${clearCount} false links.`);
    } else {
      console.log("No changes needed. Everything is already up to date.");
    }
    process.exit(0);
  });
}

run().catch(console.error);
