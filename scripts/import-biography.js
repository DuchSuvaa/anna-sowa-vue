import admin from 'firebase-admin'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const serviceAccount = require('../firebase.json')
const biography = require('../biography.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

async function importBiography() {
  const collectionRef = db.collection('biography')

  // Delete all existing docs first
  const existing = await collectionRef.get()
  const deleteOps = existing.docs.map(doc => doc.ref.delete())
  await Promise.all(deleteOps)
  console.log(`🗑  Deleted ${existing.docs.length} existing document(s)`)

  // Import with auto-generated IDs
  for (const section of biography) {
    const docRef = await collectionRef.add(section)
    console.log(`✅ Imported section: "${section.en.title}" → ID: ${docRef.id}`)
  }

  console.log('\n✅ Biography imported successfully.')
  process.exit(0)
}

importBiography().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
