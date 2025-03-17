import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyDEglKnrtYD7vgJXuYc7fTgWcVAgvyVV0I",
  authDomain: "maccoecom1.firebaseapp.com",
  projectId: "maccoecom1",
  storageBucket: "maccoecom1.firebasestorage.app",
  messagingSenderId: "548896616139",
  appId: "1:548896616139:web:2ee13d946b32db1a63354e",
  measurementId: "G-Y27PSFPLBL"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, firebase };
