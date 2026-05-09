import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../firebase.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function renameCollection(oldName, newName) {
  console.log(`Renaming ${oldName} to ${newName}...`);
  const snapshot = await db.collection(oldName).get();
  
  if (snapshot.empty) {
    console.log(`No documents found in ${oldName}.`);
    return;
  }

  let count = 0;
  for (const doc of snapshot.docs) {
    // Copy document to new collection
    await db.collection(newName).doc(doc.id).set(doc.data());
    // Delete from old collection
    await db.collection(oldName).doc(doc.id).delete();
    count++;
  }
  
  console.log(`Successfully migrated ${count} documents from ${oldName} to ${newName}.`);
}

async function run() {
  try {
    await renameCollection('media', 'press');
    await renameCollection('works', 'multimedia');
    console.log("Migration finished.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

run();
