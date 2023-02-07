import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAuth } from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDSWNFJqCBxYAUg9RkCXrmVBlKxh_pH-zM",
  authDomain: "curso-922ab.firebaseapp.com",
  projectId: "curso-922ab",
  storageBucket: "curso-922ab.appspot.com",
  messagingSenderId: "762628153952",
  appId: "1:762628153952:web:76de894e7a308fff6d9905",
  measurementId: "G-TP4XN2Z38W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)

export { db, auth };