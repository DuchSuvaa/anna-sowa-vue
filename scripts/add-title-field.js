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

const run = async () => {
  for (const collectionName of collectionsToMigrate) {
    console.log(`Updating collection: ${collectionName}`);
    try {
      const snapshot = await db.collection(collectionName).get();
      if (snapshot.empty) {
        console.log(`  No documents found in ${collectionName}.`);
        continue;
      }

      for (const doc of snapshot.docs) {
        const item = doc.data();
        let updateData = {};

        // "Jeśli napotkasz gdzieś pole title jak np w works, to zmień je na name, 
        // po czym dodaj title i skopiuj wartość name jako title"
        if (item.title && typeof item.title === 'string' && collectionName === 'works') {
            updateData.name = item.title;
        }

        // Now decide the new value for `title` (which should be a string for the admin list to work perfectly)
        if (collectionName === 'biography') {
            updateData.title = item.en?.title || "Bio Section";
        } else if (collectionName === 'compositions') {
            updateData.title = item.name?.en || item.name || "Untitled Composition";
        } else if (collectionName === 'news') {
            updateData.title = item.description?.en || item.description || "News Post";
        } else if (collectionName === 'media') {
            updateData.title = item.mediumText?.en || item.mediumText || "Media Post";
        } else if (collectionName === 'works') {
            updateData.title = updateData.name || item.name || item.title || "Work";
        } else {
            // General fallback
            updateData.title = item.name?.en || item.name || item.title || "Item";
        }

        // Make sure title is a string
        if (typeof updateData.title === 'object' && updateData.title !== null) {
            updateData.title = updateData.title.en || updateData.title.pl || "Item";
        }

        await db.collection(collectionName).doc(doc.id).update(updateData);
        console.log(`  Updated doc: ${doc.id} | new title: "${updateData.title}"`);
      }
      console.log(`Successfully updated labels in ${collectionName}`);
    } catch (err) {
      console.error(`Error migrating ${collectionName}:`, err);
    }
  }
}

run();
