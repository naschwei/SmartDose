// Import the functions you need from the SDKs you need
// import * as firebase from "firebase";
// import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth } from "firebase/auth";

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0WINpa1MmPEFv17RFOPb42gyW7fN03zw",
  authDomain: "smartdose-33e70.firebaseapp.com",
  projectId: "smartdose-33e70",
  storageBucket: "smartdose-33e70.appspot.com",
  messagingSenderId: "983684337341",
  appId: "1:983684337341:web:66ebc334f0c5af7f9f71d4"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

// const auth = getAuth(app);
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db, firebase }