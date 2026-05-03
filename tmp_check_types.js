import { db } from './src/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';

async function getUniqueTypes() {
  const collections = ['compositions', 'works', 'media'];
  for (const colName of collections) {
    const querySnapshot = await getDocs(collection(db, colName));
    const types = new Set();
    const mediaTypes = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.type) types.add(data.type);
      if (data['music-type']) types.add(data['music-type']);
      if (data['media-type']) mediaTypes.add(data['media-type']);
    });
    console.log(`Collection: ${colName}`);
    console.log(`  Types: ${Array.from(types).join(', ')}`);
    console.log(`  Media Types: ${Array.from(mediaTypes).join(', ')}`);
  }
}

getUniqueTypes();
