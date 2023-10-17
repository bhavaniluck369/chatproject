
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBHpNU3SCKtmI2VauMpBCVSOraUYexXxnI",
    authDomain: "chatproject-a7508.firebaseapp.com",
    projectId: "chatproject-a7508",
    storageBucket: "chatproject-a7508.appspot.com",
    messagingSenderId: "404997925016",
    appId: "1:404997925016:web:21e82db1483eb1e9f208ed"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

