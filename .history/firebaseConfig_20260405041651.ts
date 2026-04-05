import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIwiTEnomwZoNaAd8X_xksN7AepWH64qI",
  authDomain: "nearwear-8fc71.firebaseapp.com",
  projectId: "nearwear-8fc71",
  storageBucket: "nearwear-8fc71.firebasestorage.app",
  messagingSenderId: "658283130251",
  appId: "1:658283130251:web:a6a67638a3cd2eee51938e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
