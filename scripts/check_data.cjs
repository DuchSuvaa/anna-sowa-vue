const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('../anna-sowa-firebase-adminsdk-fbsvc-9d14fff9c6.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function checkData() {
  const collectionRef = db.collection('multimedia');
  const snapshot = await collectionRef.limit(5).get();

  snapshot.forEach(doc => {
    console.log('Doc ID:', doc.id);
    console.log('Data:', JSON.stringify(doc.data(), null, 2));
    console.log('-------------------');
  });
}

checkData().catch(console.error);
