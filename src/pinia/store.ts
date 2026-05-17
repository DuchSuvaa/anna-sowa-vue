import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router/index.js'
import { db, auth } from '../firebase/config.js'
import { signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, setDoc, query, orderBy, limit, startAfter, where } from 'firebase/firestore'

export const useStore = defineStore('main', () => {
  // State
  const toasts = ref([])
  const things = ref([])
  const user = ref(null)
  const globalSettings = ref({ itemsPerPage: 10 })

  // Actions
  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const setError = (err) => {
    const msg = typeof err === 'string' ? err : (err && err.message ? err.message : 'An unknown error occurred')
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message: msg, type: 'error' })
    setTimeout(() => removeToast(id), 8000)
  }

  const setNotification = (notif) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message: notif, type: 'success' })
    setTimeout(() => removeToast(id), 8000)
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

  const changePassword = async (newPassword: string) => {
    try {
      if (!auth.currentUser) throw new Error('Not authenticated')
      await updatePassword(auth.currentUser, newPassword)
      setNotification('Password updated successfully')
    } catch (err: any) {
      setError(err.message || 'Error updating password')
      throw err
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

  const getPaginatedCollection = async (colName: string, lastVisibleDoc: any = null, limitCount: number = 10, sortField: string | null = 'timestamp', sortDir: 'asc' | 'desc' = 'desc', filterField: string | null = null, filterValue: any = null, ...otherLevels: any[]) => {
    const processedDocs: any[] = []
    let lastVisible = null
    try {
      let q
      const collectionRef = collection(db, colName, ...otherLevels)
      
      let queryConstraints = []
      if (sortField) {
        queryConstraints.push(orderBy(sortField, sortDir))
      }
      
      if (filterField && filterValue) {
        queryConstraints.push(where(filterField, '==', filterValue))
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
    toasts, removeToast, things, user, globalSettings, setError, setNotification, login, logout, getDocument, getCollection, getPaginatedCollection, formatDate, loadSettings, saveSettings, changePassword
  }
})