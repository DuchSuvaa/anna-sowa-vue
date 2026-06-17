const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../anna-sowa-firebase-adminsdk-fbsvc-9d14fff9c6.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function auditMultimedia() {
  const snapshot = await db.collection('multimedia').get();
  const fieldNames = new Set();
  let emptyDescriptionCount = 0;
  let nonEmptyDescriptionCount = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    Object.keys(data).forEach(key => fieldNames.add(key));
    
    // Check description field specifically
    if (!data.description || (typeof data.description === 'string' && data.description.trim() === '') || 
        (typeof data.description === 'object' && !data.description.en && !data.description.pl)) {
      emptyDescriptionCount++;
    } else {
      nonEmptyDescriptionCount++;
    }
  });

  console.log('--- Kolekcja Multimedia: Audit ---');
  console.log('Znalezione pola (klucze):', Array.from(fieldNames));
  console.log('Dokumenty z pustym description:', emptyDescriptionCount);
  console.log('Dokumenty z niepustym description:', nonEmptyDescriptionCount);
}
auditMultimedia().catch(console.error);
