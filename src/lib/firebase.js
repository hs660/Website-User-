// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvtztGcI0XQPdwKq7A9oxyy6Il5V1TuVc",
  authDomain: "img-gallery-application.firebaseapp.com",
  projectId: "img-gallery-application",
  storageBucket: "img-gallery-application.firebasestorage.app",
  messagingSenderId: "667418105157",
  appId: "1:667418105157:web:86c3c49970d0546e399a2c",
  measurementId: "G-SV27JF0PRK"
};


const app = initializeApp(firebaseConfig);

// ✅ IMPORTANT EXPORTS
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();