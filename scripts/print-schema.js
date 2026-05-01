import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../firebase.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  const cols = ['biography', 'compositions', 'news', 'media', 'works'];
  for (const c of cols) {
    const r = await db.collection(c).limit(1).get();
    if (!r.empty) {
      console.log(`--- ${c} schema ---`);
      console.log(r.docs[0].data());
    } else {
      console.log(`${c} is empty`);
    }
  }
}
run();
