// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaE2w9-Sk4JaBQFK-7VQND-ykP_qPR9J8",
  authDomain: "medi-core-4c564.firebaseapp.com",
  projectId: "medi-core-4c564",
  storageBucket: "medi-core-4c564.firebasestorage.app",
  messagingSenderId: "296681490977",
  appId: "1:296681490977:web:0df9d6523d2aa9ca6ab160"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)