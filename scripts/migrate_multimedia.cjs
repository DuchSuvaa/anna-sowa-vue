const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Use the actual file found
const serviceAccount = require('../anna-sowa-firebase-adminsdk-fbsvc-9d14fff9c6.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function migrateMultimedia() {
  const collectionRef = db.collection('multimedia');
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  const batch = db.batch();
  let count = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    const update = {};

    // Only migrate if fields aren't already migrated to objects
    if (data.info && typeof data.info !== 'object') {
      update.info = {
        en: data.info || '',
        pl: data.info || ''
      };
    }
    
    if (data.description && typeof data.description !== 'object') {
      update.description = {
        en: data.description || '',
        pl: data.description || ''
      };
    }

    if (Object.keys(update).length > 0) {
      batch.update(doc.ref, update);
      count++;
    }
  });

  if (count > 0) {
    await batch.commit();
    console.log(`Successfully migrated ${count} documents.`);
  } else {
    console.log('No documents needed migration.');
  }
}

migrateMultimedia().catch(console.error);
