const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('../anna-sowa-firebase-adminsdk-fbsvc-9d14fff9c6.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function fixEmptyFields() {
  const collectionRef = db.collection('multimedia');
  const snapshot = await collectionRef.get();

  const batch = db.batch();
  let count = 0;
  let batchCount = 0;

  // Firestore batch limit is 500
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const update = {};

    // Fix info
    if (typeof data.info !== 'object' || data.info === null) {
      update.info = {
        en: typeof data.info === 'string' ? data.info : '',
        pl: typeof data.info === 'string' ? data.info : ''
      };
    }

    // Fix description
    if (typeof data.description !== 'object' || data.description === null) {
      update.description = {
        en: typeof data.description === 'string' ? data.description : '',
        pl: typeof data.description === 'string' ? data.description : ''
      };
    }

    if (Object.keys(update).length > 0) {
      batch.update(doc.ref, update);
      count++;
      batchCount++;
      console.log(`Updating doc ${doc.id}:`, update);
      
      if (batchCount === 500) {
        await batch.commit();
        batchCount = 0;
        console.log('Committed batch.');
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log('Committed final batch.');
  }

  console.log(`Successfully fixed ${count} documents.`);
}

fixEmptyFields().catch(console.error);
