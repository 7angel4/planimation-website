import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {capitaliseFirstLetter} from "./util.js";

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};
const NOT_FOUND_PAGE_URL = "/404.html";
export const DB = initializeFirestore();

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

/**
 * Loads the document content dynamically from the database.
 * @param event: the event to be handled
 * @param collection: string representing the name of the collection, from which data is to be retrieved
 * @param dataType: string representing the type of data to retrieve
 * @param identifierAttribute: string representing the attribute used to identify/select the document
 * @param action: function taking the document as a parameter;
 *                represents the action to perform on the retrieved document
 */
export function loadDocumentContent(event, collection, dataType, identifierAttribute, action) {
    // Check if the clicked link is of the correct type
    if (event && event.target.dataset.type !== dataType) {
        return;
    }
    // Extract the functionName from the URL path
    const pathSegments = window.location.pathname.split('/');
    const identifierValue = pathSegments[pathSegments.length - 1]; // Assuming the last segment is the functionName
    // Fetch the function content from Firestore
    DB.collection(collection).where(identifierAttribute, "==", identifierValue).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            action(doc);
        } else {
            console.error(capitaliseFirstLetter(`${dataType} not found!`));
            window.location.href = NOT_FOUND_PAGE_URL;
        }
    }).catch((error) => {
        console.error(`Error fetching ${dataType} content: `, error);
    });
}