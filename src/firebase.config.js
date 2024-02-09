// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD5n9G9o9MQqpkjUtu2WRsVJnhTN-6tsZw",
    authDomain: "real-estate-marketplace-c9c64.firebaseapp.com",
    projectId: "real-estate-marketplace-c9c64",
    storageBucket: "real-estate-marketplace-c9c64.appspot.com",
    messagingSenderId: "1029795832707",
    appId: "1:1029795832707:web:f7fc411ee95c7860bb4cb6",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
