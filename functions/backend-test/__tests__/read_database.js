const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator,collection, doc, getDocs, query, where, setDoc, deleteDoc, getDoc} = require('firebase/firestore');
import { TEST_FUNCTIONS_VALID, FIREBASE_CONFIG, getAllFunc, TEST_VISUAL_PROPERTY, TEST_DOMAIN_VALID} from './test_data_constants';
const FUNCTION_COLLECTION = "function";
const PARAMETER_COLLECTION = "parameters";
const DOMAIN_COLLECTION = "animation";
const VISUAL_PROPERTY_COLLECTION = "visualProperty";
const DATATYPE_COLLECTION = "dataType";

describe('Read from database', () => {
    let db;
    // Initialize Firestore Emulator, load test data
    beforeAll(async () => {
        try {
            // Initialize Firebase with the emulator configuration
            const app = initializeApp(FIREBASE_CONFIG);
            
            // Get a Firestore instance from Firebase
            db = getFirestore(app);
            connectFirestoreEmulator(db, 'localhost', 8080);
            
            // write test data into database
            await storeFunc(TEST_FUNCTIONS_VALID, db);
            await storeProperties(TEST_VISUAL_PROPERTY, db);
            await storeDomain(TEST_DOMAIN_VALID, db);

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

/**
 * Store functions into the database
 * @param functions: array of functions to be stored into database
 * @param db: the databse to interact with
 */
async function storeFunc(functions, db) {
    for (const func of getAllFunc(functions,false)) {
        let docRef = doc(db, FUNCTION_COLLECTION, func.desc.functionName); 
        await setDoc(docRef, func.desc);
        // write function parameters
        let parameters = func.parameters;
        if (parameters.length > 0) {
            const subcollectionRef = collection(docRef, PARAMETER_COLLECTION);
            for (let i=0; i < parameters.length; i++) {
                await setDoc(doc(subcollectionRef, parameters[i].parameterName), parameters[i]);
            }
        }
    }
}

/**
 * Store visual properties into the database
 * @param properties: array of visual properties to be stored into database
 * @param db: the databse to interact with
 */
async function storeProperties(properties, db) {
    for (const visualProperty of properties) {
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
}

/**
 * Store domains into the database
 * @param domains: array of domains to be stored into database
 * @param db: the databse to interact with
 */
async function storeDomain(domains, db) {
    for (const domain of domains) {
        let docRef = doc(db, DOMAIN_COLLECTION, domain.name); 
        await setDoc(docRef, domain);
    }
}