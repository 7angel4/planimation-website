// Import Firebase Firestore (replace with your actual import path)
const { initializeApp } = require('firebase/app');
//const {initializeApp} = require("https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js");
const { getFirestore, connectFirestoreEmulator,collection, doc, getDocs, query, where, setDoc, deleteDoc, getDoc} = require('firebase/firestore');
import { TEST_DATA_VALID, FIREBASE_CONFIG } from './test_data_constants';

describe('Read from database', () => {
    let db;
    const FUNCTION_COLLECTION = "functions";
  

    // Initialize Firestore Emulator
    beforeAll(async () => {
        try {
            // Initialize Firebase with the emulator configuration
            const app = initializeApp(FIREBASE_CONFIG);
            
            // Get a Firestore instance from Firebase
            db = getFirestore(app);
            connectFirestoreEmulator(db, 'localhost', 8080);
            
            // write each valid functions into database
            for (const validFunction of TEST_DATA_VALID) {
                let docRef = doc(db, FUNCTION_COLLECTION, validFunction.functionName); 
                await setDoc(docRef, validFunction);
            }
        } catch (error) {
            console.error('Firestore Error:', error);
        }
    });

    it('can read from database', async () => {
        for (const validFunction of TEST_DATA_VALID) {
            const q = query(collection(db, FUNCTION_COLLECTION), where('functionName', '==', validFunction.functionName));
            let nMatch;

            // Use getDocs to fetch documents that match the query
            await getDocs(q)
            .then((querySnapshot) => {
                nMatch = querySnapshot.size;
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
            expect(nMatch).toBe(1);
        }
    });

});