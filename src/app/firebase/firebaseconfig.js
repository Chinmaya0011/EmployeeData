import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr6Q6fci08E-rYoUcSsRfm-gkr2uaPrVQ",
  authDomain: "finasorstaff.firebaseapp.com",
  projectId: "finasorstaff",
  storageBucket: "finasorstaff.appspot.com",
  messagingSenderId: "798364087512",
  appId: "1:798364087512:web:fc4c76e11b3073f258d3ad",
  measurementId: "G-XKVXMPDBEV"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };