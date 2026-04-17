import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvt49e7K96nZvye7X4-MEPvZDCg9GFIRw",
  authDomain: "anna-sowa.firebaseapp.com",
  projectId: "anna-sowa",
  storageBucket: "anna-sowa.firebasestorage.app",
  messagingSenderId: "689231365288",
  appId: "1:689231365288:web:d47f804137138e6b996e9d"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()


export { auth, db }