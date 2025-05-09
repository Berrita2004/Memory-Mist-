// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO0LXWUlHNUy04Dse0sC22Gy7cLJG5quo",
  authDomain: "memoryjar-da156.firebaseapp.com",
  projectId: "memoryjar-da156",
  storageBucket: "memoryjar-da156.appspot.com",
  messagingSenderId: "550758452772",
  appId: "1:550758452772:web:847516990713577bdf52b1",
  measurementId: "G-C4SQG724CR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export all services individually
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
