// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider,setPersistence, browserLocalPersistence } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvFpdZZHvbvqmaNXM7a6SCi-Q15x0n-AU",
  authDomain: "splitly-tw.firebaseapp.com",
  projectId: "splitly-tw",
  storageBucket: "splitly-tw.firebasestorage.app",
  messagingSenderId: "136502493842",
  appId: "1:136502493842:web:b7968de800a15af4f71c4b",
  measurementId: "G-B8TZL9SXR5"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("🔥 Firebase auth persistence error:", error);
});

export { db };
export { auth, provider };