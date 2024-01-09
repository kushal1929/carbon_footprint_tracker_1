import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCR_zM2ARzxCx03U3Sz-zzKpLOAGCXs-QQ",
  authDomain: "eco-footprint-tracker.firebaseapp.com",
  projectId: "eco-footprint-tracker",
  storageBucket: "eco-footprint-tracker.appspot.com",
  messagingSenderId: "620362634074",
  appId: "1:620362634074:web:c3f3ed7905d616a0749963"
};

export const app = initializeApp(firebaseConfig);