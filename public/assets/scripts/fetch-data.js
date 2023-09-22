import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, connectFirestoreEmulator, collection, getDocs, doc, query, where} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { capitaliseFirstLetter, convertToMarkdown } from "./general-util.js";

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
    const app = initializeApp(FIREBASE_CONFIG);
    // Initialize Firebase
    const db = getFirestore(app);
    // Using emulator firestore when ran locally for testing
    // use '127.0.0.1' as hostname instead if want to connect to production firestore
    if (location.hostname === 'localhost') {
        connectFirestoreEmulator(db, "localhost", 8080);
    }
    // Initialize Firestore
    return db;
}

/**
 * Fetch documentation from Firestore for the given collection,
 * and performs the action on the documents
 * @param collectionName: string representing the name of the collection from which data is to be fetched
 * @param action: a function taking a document as its parameter,
 *                representing the action to be performed on the documents
 */
export function fetchDocFromCollection(collectionName, action) {
    const q = query(collection(DB, collectionName));
    getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            action(doc);
            convertToMarkdown();
        });
    }).catch((error) => {
        console.error("Error fetching documents for " + collectionName + ": ", error);
    });
}

/**
 * Fetch documentation from Firestore for the given collection,
 * and performs the action on the documents
 * @param parentCollection: string representing the name of the parent collection
 * @param childCollection: string representing the name of the sub-collection
 *                         (i.e. a collection within the parent collection) from which data is to be fetched
 * @param docId: string representing the ID of the document to be fetched
 * @param action: a function taking a query snapshot as its parameter,
 *                representing the action to be performed on the query snapshot
 */
export function fetchDocFromSubCollection(parentCollection, childCollection, docId, action) {
    const subCollectionRef = collection(doc(DB, parentCollection, docId), childCollection);
    const q = query(subCollectionRef);
    getDocs(q).then((querySnapshot) => {
        action(querySnapshot);
    }).catch((error) => {
        console.error(`Error fetching ${childCollection}: `, error);
    });
}

/**
 * Loads the document content dynamically from the database.
 * @param collection: string representing the name of the collection, from which data is to be retrieved
 * @param dataType: string representing the type of data to retrieve
 * @param identifierAttribute: string representing the attribute used to identify/select the document
 * @param action: function taking the document as a parameter;
 *                represents the action to perform on the retrieved document
 */
export function loadDocumentContent(collectionName, dataType, identifierAttribute, action) {
    // Extract the functionName from the URL path
    const pathSegments = window.location.pathname.split('/');
    const identifierValue = pathSegments[pathSegments.length - 1]; // Assuming the last segment is the functionName
    // Fetch the function content from Firestore
    const q = query(collection(DB, collectionName), where(identifierAttribute, '==', identifierValue));
    getDocs(q).then((querySnapshot) => {
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