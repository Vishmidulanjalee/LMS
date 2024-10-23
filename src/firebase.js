// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQ2x5PeeH5G4jsCc9OTb8F7ZZs13lqdsQ",
  authDomain: "thebeeacademy-c3941.firebaseapp.com",
  projectId: "thebeeacademy-c3941",
  storageBucket: "thebeeacademy-c3941.appspot.com",
  messagingSenderId: "412978716228",
  appId: "1:412978716228:web:0ebd07ba21a9be61f5e611",
  measurementId: "G-EQB147Z6KB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services
export { app, auth, db };
