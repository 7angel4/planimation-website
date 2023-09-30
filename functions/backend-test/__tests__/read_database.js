const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator,collection, doc, getDocs, query, where, setDoc, deleteDoc, getDoc} = require('firebase/firestore');
import { TEST_FUNCTIONS_VALID, FIREBASE_CONFIG, getAllFunc, TEST_VISUAL_PROPERTY} from './test_data_constants';

describe('Read from database', () => {
    let db;
    const FUNCTION_COLLECTION = "function";
    const PARAMETER_COLLECTION = "parameters";
    const VISUAL_PROPERTY_COLLECTION = "visualProperty";
    const DATATYPE_COLLECTION = "dataType";

    // Initialize Firestore Emulator, load test data
    beforeAll(async () => {
        try {
            // Initialize Firebase with the emulator configuration
            const app = initializeApp(FIREBASE_CONFIG);
            
            // Get a Firestore instance from Firebase
            db = getFirestore(app);
            connectFirestoreEmulator(db, 'localhost', 8080);
            
            // write each valid functions into database
            for (const validFunction of getAllFunc(TEST_FUNCTIONS_VALID,false)) {
                let docRef = doc(db, FUNCTION_COLLECTION, validFunction.desc.functionName); 
                await setDoc(docRef, validFunction.desc);
                // write function parameters
                let properties = validFunction.properties;
                if (properties.length > 0) {
                    const subcollectionRef = collection(docRef, PARAMETER_COLLECTION);
                    for (let i=0; i < properties.length; i++) {
                        await setDoc(doc(subcollectionRef, properties[i].parameterName), properties[i]);
                    }
                }
            }

            // write visual property into database
            for (const visualProperty of TEST_VISUAL_PROPERTY) {
                let docRef = doc(db, VISUAL_PROPERTY_COLLECTION, visualProperty.desc.name); 
                await setDoc(docRef, visualProperty.desc);
                // write dataTypes
                let dataTypes = visualProperty.dataTypes;
                if (dataTypes.length > 0) {
                    const subcollectionRef = collection(docRef, DATATYPE_COLLECTION);
                    for (let i=0; i < dataTypes.length; i++) {
                        await setDoc(doc(subcollectionRef, dataTypes[i].dataType), dataTypes[i]);
                    }
                }
            }
        } catch (error) {
            console.error('Firestore Error:', error);
        }
    });

    it('can read from database', async () => {
        // checks that functions stored in database can be read
        for (const validFunction of getAllFunc(TEST_FUNCTIONS_VALID, true)) {
            const q = query(collection(db, FUNCTION_COLLECTION), where('functionName', '==', validFunction.functionName));
            let nMatch;

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