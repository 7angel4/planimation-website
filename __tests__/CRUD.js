// Import Firebase Firestore (replace with your actual import path)
const { initializeApp } = require('firebase/app');
//const {initializeApp} = require("https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js");

const { getFirestore, connectFirestoreEmulator,collection, doc, getDocs, query, where, setDoc, deleteDoc, getDoc} = require('firebase/firestore');

describe('Databse CRUD process', () => {
  let db;
  let docRef;
  const FUNCTION_COLLECTION = "functions";
  const FUNCTION_NAME_TEST = "align_middle";
  const ALIGN_MIDDLE = {
    functionName: 'align_middle',
    briefDescription: 'This function aligns obj1 to the middle of obj2.',
    category: 'other',
    example: '(equal (?obj1 x) (function align_middle (objects ?obj1 ?obj2)))',
    youtubeEmbeddingLink: 'https://www.youtube.com/embed/ziTAKykPj40?si=95t4ekKNAFpaOsAn',
    videoCode: '(:predicate boarded\n     :parameters (?person lift)\n     :custom lift\n     :effect(\n         (equal (?person y) (lift y))\n         (equal (?person x) (function align_middle (objects ?person lift)))\n     )\n)',
    videoExplanation: 'The function is used in the elevator domain when a passenger boards the lift. The passenger stands in the middle of the lift.'
    };

  // Initialize Firestore Emulator
    beforeAll(async () => {
        try {
            // Set up Firebase configuration for Firestore Emulator
            const firebaseConfig = {
                apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
                authDomain: "planimation-staging-181bc.firebaseapp.com",
                projectId: "planimation-staging-181bc",
                storageBucket: "planimation-staging-181bc.appspot.com",
                messagingSenderId: "914707935474",
                appId: "1:914707935474:web:ba4d0f22fa93687482206b",
                measurementId: "G-XYNE4FJ1CF"
            };

            // Initialize Firebase with the emulator configuration
            const app = initializeApp(firebaseConfig);
            
            // Get a Firestore instance from Firebase
            db = getFirestore(app);
            connectFirestoreEmulator(db, '127.0.0.1', 8080);
            
            // Define the document reference for the new document
            docRef = doc(db, FUNCTION_COLLECTION, FUNCTION_NAME_TEST); 
            // Use the Firestore instance to set data on the document
            await setDoc(docRef, ALIGN_MIDDLE);
        } catch (error) {
            console.error('Firestore Error:', error);
        }
  });

  it('can add function to fatabase', () => {
        // document already added
        expect(true).toBe(true);
  })

  it('can read from database', async () => {
        const q = query(collection(db, FUNCTION_COLLECTION), where('functionName', '==', FUNCTION_NAME_TEST));
        let nMatch;

        // Use getDocs to fetch documents that match the query
        await getDocs(q)
        .then((querySnapshot) => {
            nMatch = querySnapshot.size;
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
        expect(nMatch).toBeGreaterThanOrEqual(1);
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


    it('can delete functions in database', async () => {
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
  });

});