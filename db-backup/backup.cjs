const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollections() {
  const backup = {};
  // Replace with your actual collection names
  const collections = ['biography', 'compositions', 'galleries', 'multimedia', 'news', 'press', 'settings'];

  for (const colName of collections) {
    backup[colName] = {};
    const snapshot = await db.collection(colName).get();
    snapshot.forEach(doc => {
      backup[colName][doc.id] = doc.data();
    });
  }

  // Generate YY-MM-DD format
  const date = new Date();
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const fileName = `${yy}-${mm}-${dd}-backup.json`;

  fs.writeFileSync(fileName, JSON.stringify(backup, null, 2));
  console.log(`Backup complete! Saved as ${fileName}`);
}

exportCollections();