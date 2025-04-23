// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAd0WMk5ItpOaPa_i_SL6XQnetdO2R1eTw",
  authDomain: "biowas-26179.firebaseapp.com",
  projectId: "biowas-26179",
  storageBucket: "biowas-26179.firebasestorage.app",
  messagingSenderId: "880023302797",
  appId: "1:880023302797:web:3f497897c821140f65e8c4",
  measurementId: "G-YS59SZ4PT3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

export { auth };

const db = getFirestore(app);

export { db, ref, onValue, set, push, remove };