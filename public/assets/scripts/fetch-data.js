import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};

/**
 * Initializes Cloud Firestore.
 * @returns {*}: a reference to an instance of Cloud Firestore.
 */
export function initializeFirestore() {
    initializeApp(FIREBASE_CONFIG);
    // Initialize Firebase
    firebase.initializeApp(FIREBASE_CONFIG);
    // Initialize Firestore
    return firebase.firestore();
}