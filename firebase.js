// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const auth = firebase.auth()

export { auth };