import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCoXQmf3eGMa-EJjtIXBdAo8QXfPTXBWW4",
  authDomain: "take-time-4e0ad.firebaseapp.com",
  databaseURL: "https://take-time-4e0ad-default-rtdb.firebaseio.com",
  projectId: "take-time-4e0ad",
  storageBucket: "take-time-4e0ad.firebasestorage.app",
  messagingSenderId: "47360195661",
  appId: "1:47360195661:web:da582907dd3369ec1cf004"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
