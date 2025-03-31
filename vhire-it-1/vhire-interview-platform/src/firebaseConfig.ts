// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvCpgPVqkK-7iQQHflEtyFEHrzvRXqGlA",
  authDomain: "vhire-auth-backend.firebaseapp.com",
  projectId: "vhire-auth-backend",
  storageBucket: "vhire-auth-backend.firebasestorage.app",
  messagingSenderId: "1003604212360",
  appId: "1:1003604212360:web:fc5220d005f44ad2b47d3d",
  measurementId: "G-HTW50NEQKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   const provider = new GoogleAuthProvider();

   export { auth, provider };