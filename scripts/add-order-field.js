import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../firebase.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const collectionsToMigrate = ['biography', 'compositions', 'news', 'media', 'works'];

async function migrate() {
  for (const collectionName of collectionsToMigrate) {
    console.log(`Migrating collection: ${collectionName}`);
    try {
      // First, get ALL documents in the collection regardless of timestamp
      const allDocsSnapshot = await db.collection(collectionName).get();
      
      if (allDocsSnapshot.empty) {
        console.log(`  No documents found in ${collectionName}.`);
        continue;
      }

      // Convert to array to sort manually in JavaScript
      let docsArray = [];
      allDocsSnapshot.forEach(doc => {
        docsArray.push({ id: doc.id, data: doc.data() });
      });

      // Sort array so that NEWEST is first (lowest index)
      // Newest should have the highest timestamp value
      docsArray.sort((a, b) => {
        const timeA = a.data.timestamp ? (a.data.timestamp.toMillis ? a.data.timestamp.toMillis() : (a.data.timestamp.seconds * 1000 || 0)) : 0;
        const timeB = b.data.timestamp ? (b.data.timestamp.toMillis ? b.data.timestamp.toMillis() : (b.data.timestamp.seconds * 1000 || 0)) : 0;
        
        // Descending order (highest timestamp / newest item -> comes first / lower index)
        return timeB - timeA; 
      });

      let index = 0;
      for (const item of docsArray) {
        await db.collection(collectionName).doc(item.id).update({
          order: index
        });
        console.log(`  Updated doc: ${item.id} with order: ${index} (Timestamp: ${item.data.timestamp ? 'yes' : 'no'})`);
        index++;
      }
      console.log(`Successfully migrated ${collectionName}`);
    } catch (err) {
      console.error(`Error migrating ${collectionName}:`, err);
    }
  }
  console.log("Migration finished.");
}

migrate();
