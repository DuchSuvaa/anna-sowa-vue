const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('../anna-sowa-firebase-adminsdk-fbsvc-9d14fff9c6.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function fixDescription() {
  const collectionRef = db.collection('multimedia');
  const snapshot = await collectionRef.get();

  const batch = db.batch();
  let count = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    
    // Check if description is not an object (i.e., it's a string or empty)
    // AND it has content that should be moved
    if (data.description && typeof data.description !== 'object') {
      batch.update(doc.ref, {
        description: {
          en: data.description,
          pl: data.description
        }
      });
      count++;
    }
  });

  if (count > 0) {
    await batch.commit();
    console.log(`Successfully fixed description for ${count} documents.`);
  } else {
    console.log('No documents needed fixing.');
  }
}

fixDescription().catch(console.error);
