const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('annasowa.WordPress.2026-03-09.xml');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentItem = null;
  let inItem = false;
  let items = [];

  for await (const line of rl) {
    if (line.includes('<item>')) {
      inItem = true;
      currentItem = '';
    } else if (line.includes('</item>')) {
      inItem = false;
      if (currentItem.toLowerCase().includes('video') || currentItem.toLowerCase().includes('multimedia')) {
        // Simple extraction of title and link for demonstration
        const titleMatch = currentItem.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
        const linkMatch = currentItem.match(/<link>(.*?)<\/link>/);
        
        items.push({
          title: titleMatch ? titleMatch[1] : 'Unknown',
          link: linkMatch ? linkMatch[1] : 'Unknown',
          raw_meta: currentItem // Keeping raw for now as it's complex
        });
      }
      currentItem = null;
    } else if (inItem) {
      currentItem += line;
    }
  }

  fs.writeFileSync('works_extracted.json', JSON.stringify(items, null, 2));
  console.log('Extracted', items.length, 'items to works_extracted.json');
}

processLineByLine();
