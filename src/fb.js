import firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyCadmaZPOBM16FPEXV2i8W12fDMHlHdOuY",
    authDomain: "recettes-d514f.firebaseapp.com",
    databaseURL: "https://recettes-d514f.firebaseio.com",
    projectId: "recettes-d514f",
    storageBucket: "recettes-d514f.appspot.com",
    messagingSenderId: "478574558130",
    appId: "1:478574558130:web:db1fb044d7c9c9b3bec2ab",
    measurementId: "G-RT0JBBRSNG"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
const db = firebase.firestore();
const auth = firebase.auth();

export default {db,auth};