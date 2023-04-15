// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3p_-wnfbcmdc8ts_27PglsbPrGQ-ewY4",
  authDomain: "realtor-clone-52b5b.firebaseapp.com",
  projectId: "realtor-clone-52b5b",
  storageBucket: "realtor-clone-52b5b.appspot.com",
  messagingSenderId: "532699168634",
  appId: "1:532699168634:web:07ecc5a02effb0b032a0c3",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
