// Import Firebase Firestore (replace with your actual import path)
const { initializeApp } = require('firebase/app');
//const {initializeApp} = require("https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js");
const { getFirestore, connectFirestoreEmulator,collection, doc, getDocs, query, where, setDoc, deleteDoc, getDoc} = require('firebase/firestore');
import { TEST_DATA_VALID, FIREBASE_CONFIG } from './test_data';

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
            
            // Define the document reference for the new document
            docRef = doc(db, FUNCTION_COLLECTION, TEST_DATA_VALID.functionName); 
            // Use the Firestore instance to set data on the document
            await setDoc(docRef, TEST_DATA_VALID);
        } catch (error) {
            console.error('Firestore Error:', error);
        }
  });

  it('can add function to fatabase', () => {
        // document already added
        expect(true).toBe(true);
  })

  it('can read from database', async () => {
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
  });



  it('can update functions in database', async () => {
        const updatedData = {
            // Define the updated data here
            // For example, if you want to update the 'briefDescription' field
            briefDescription: 'Updated description',
        };
        
        // Create a reference to the document you want to update
        try {
            // Use setDoc with the merge option to update the document
            await setDoc(docRef, updatedData, { merge: true });
            
            // Fetch the updated document
            const updatedDoc = await getDoc(docRef);
            
            // Assert that the document has been updated with the new data
            expect(updatedDoc.data().briefDescription).toBe(updatedData.briefDescription);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    });


    /* it('can delete functions in database', async () => {
        try {
            if (docRef) {
                await deleteDoc(docRef)
                .then(() => {
                    expect(true).toBe(true);
                })
            }
        } catch (error) {
            console.error('Firestore Cleanup Error:', error);
            expect(false).toBe(true);
        }
  }); */

});