// Import Firebase Firestore (replace with your actual import path)
const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator,collection, doc, getDocs, query, where, deleteDoc} = require('firebase/firestore');
import { TEST_DATA_VALID, FIREBASE_CONFIG } from '../test_data';


describe('Databse CRUD process', () => {
  let db;
  let docRef;
  const FUNCTION_COLLECTION = "functions";
  

    // Initialize Firestore Emulator
    beforeAll(async () => {
        try {
            // Initialize Firebase with the emulator configuration
            const app = initializeApp(FIREBASE_CONFIG);
            
            // Get a Firestore instance from Firebase
            db = getFirestore(app);
            connectFirestoreEmulator(db, 'localhost', 8080);
            
            // Retrieve the document reference
            docRef = doc(db, FUNCTION_COLLECTION, TEST_DATA_VALID.functionName); 
            
        } catch (error) {
            console.error('Firestore Error:', error);
        }
    });

    it('can delete functions in database', async () => {
        const q = query(collection(db, FUNCTION_COLLECTION), where('functionName', '==', TEST_DATA_VALID.functionName));
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

        // delete it
        try {
            if (docRef && (nMatch>0)) {
                await deleteDoc(docRef)
                .then(() => {
                    expect(true).toBe(true);
                })
            }
        } catch (error) {
            console.error('Firestore Cleanup Error:', error);
            expect(false).toBe(true);
        }
    });

});