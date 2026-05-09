import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router/index.js'
import { db, auth } from '../firebase/config.js'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, setDoc, query, orderBy, limit, startAfter } from 'firebase/firestore'

export const useStore = defineStore('main', () => {
  // State
  const error = ref(null)
  const notification = ref(null)
  const things = ref([])
  const user = ref(null)
  const globalSettings = ref({ itemsPerPage: 10 })

  // Actions
  const setError = (err) => {
    error.value = err
    setTimeout(() => { error.value = null }, 8000)
  }

  const setNotification = (notif) => {
    notification.value = notif
    setTimeout(() => { notification.value = null }, 8000)
  }

  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      if (res) {
        user.value = res.user
        router.push('/admin')
      }
    } catch (err) {
      setError(err)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      router.push('/login')
    } catch (err) {
      setError(err)
    }
  }

  const getDocument = async (colName, docName, ...otherLevels) => {
    const docRef = doc(db, colName, docName, ...otherLevels)
    const document = await getDoc(docRef)
    return document.data()
  }

  const getCollection = async (colName, ...otherLevels) => {
    const processedDocs = []
    try {
      const collectionRef = collection(db, colName, ...otherLevels)
      const documents = await getDocs(collectionRef)
      documents.forEach(doc => {
        processedDocs.push({ ...doc.data(), id: doc.id })
      })
    } catch (err) {
      setError(err)
    }
    return processedDocs
  }

  const getPaginatedCollection = async (colName: string, lastVisibleDoc: any = null, limitCount: number = 10, sortField: string | null = 'timestamp', sortDir: 'asc' | 'desc' = 'desc', ...otherLevels: any[]) => {
    const processedDocs: any[] = []
    let lastVisible = null
    try {
      let q
      const collectionRef = collection(db, colName, ...otherLevels)
      
      let queryConstraints = []
      if (sortField) {
        queryConstraints.push(orderBy(sortField, sortDir))
      }
      
      if (lastVisibleDoc) {
        queryConstraints.push(startAfter(lastVisibleDoc))
      }
      
      queryConstraints.push(limit(limitCount))
      
      q = query(collectionRef, ...queryConstraints)
      
      const documentSnapshots = await getDocs(q)
      
      documentSnapshots.forEach(doc => {
        processedDocs.push({ ...(doc.data() as object), id: doc.id })
      })
      
      if (documentSnapshots.docs.length > 0) {
        lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]
      }
    } catch (err) {
      setError(err)
    }
    return { docs: processedDocs, lastVisible }
  }

  const formatDate = (ts: any) => {
    if (!ts) return ''
    const date = ts.toDate ? ts.toDate() : new Date(ts._seconds ? ts._seconds * 1000 : ts)
    return date.toLocaleString()
  }

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        globalSettings.value = { ...globalSettings.value, ...docSnap.data() }
      }
    } catch (err) {
      console.error(err)
    }
    return globalSettings.value
  }

  const saveSettings = async (newSettings: any) => {
    try {
      const docRef = doc(db, 'settings', 'general')
      await setDoc(docRef, newSettings, { merge: true })
      globalSettings.value = { ...globalSettings.value, ...newSettings }
    } catch (err) {
      setError(err)
      throw err
    }
  }

  return {
    error, notification, things, user, globalSettings, setError, setNotification, login, logout, getDocument, getCollection, getPaginatedCollection, formatDate, loadSettings, saveSettings
  }
})