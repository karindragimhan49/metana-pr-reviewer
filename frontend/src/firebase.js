// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArXLZF0iXodunw9QK42mTibDrOAhezu0E",
  authDomain: "metana-5dab5.firebaseapp.com",
  projectId: "metana-5dab5",
  storageBucket: "metana-5dab5.firebasestorage.app",
  messagingSenderId: "199175203158",
  appId: "1:199175203158:web:1de5a22d5d43d321798ef7",
  measurementId: "G-M9M4RRPY7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();import { getAuth, GoogleAuthProvider } from "firebase/auth";