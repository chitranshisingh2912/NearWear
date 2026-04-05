import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// LOCAL FIREBASE CONFIG - NO IMPORT NEEDED
const firebaseConfig = {
  apiKey: "AIzaSyAIwiTEnomwZoNaAd8X_xksN7AepWH64qI",
  authDomain: "nearwear-8fc71.firebaseapp.com",
  projectId: "nearwear-8fc71",
  storageBucket: "nearwear-8fc71.firebasestorage.app",
  messagingSenderId: "658283130251",
  appId: "1:658283130251:web:a6a67638a3cd2eee51938e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// LOCAL COLORS
const C = {
  bg: "#FFF0F3",
  card: "#FFFFFF",
  surface: "#FFE4EC",
  border: "rgba(212,67,124,0.18)",
  borderLight: "rgba(212,67,124,0.10)",
  primary: "#D4437C",
  primaryDark: "#B8326E",
  primarySoft: "rgba(212,67,124,0.10)",
  text: "#1A1A2E",
  textSec: "#5A5A7A",
  textMuted: "#9E9EBE",
  white: "#FFFFFF",
  error: "#EF4444",
  inputBg: "#FFFFFF",
  inputBorder: "rgba(212,67,124,0.25)",
  shadow: "rgba(212,67,124,0.08)",
};

// ... rest of your signup code with auth and db usage
