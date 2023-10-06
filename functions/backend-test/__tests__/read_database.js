const { initializeApp } = require('firebase/app');
const admin = require('firebase-admin');
const { getFirestore, connectFirestoreEmulator,collection, doc, getDocs, query, where, 
    setDoc } = require('firebase/firestore');
import { TEST_FUNCTIONS_VALID, FIREBASE_CONFIG, getAllFunc, TEST_VISUAL_PROPERTY, 
    TEST_DOMAIN_VALID} from './test_data_constants';
const FUNCTION_COLLECTION = "function";
const PARAMETER_COLLECTION = "parameter";
const DOMAIN_COLLECTION = "animation";
const VISUAL_PROPERTY_COLLECTION = "visualProperty";
const DATATYPE_COLLECTION = "dataType";
const CI_ADMIN_CREDENTIAL = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const LOCAL_ADMIN_CREDENTIAL = '../../adminsdk.json';


describe('Read from database', () => {
    let db;

    beforeAll(async () => {
        // load test data
        await loadTestData();
        // initialise client emulator firestore
        const app = initializeApp(FIREBASE_CONFIG);
        db = getFirestore(app);
        connectFirestoreEmulator(db, 'localhost', 8080);
    });

    it('allow anyone to read from database', async () => {
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

    it('disallow anyone to write to database', async () => {
        // attempt to write functions
        try{
            for (const func of getAllFunc(TEST_FUNCTIONS_VALID,true)) {
                let docRef = doc(db, FUNCTION_COLLECTION, func.functionName); 
                await setDoc(docRef, func);
            }
            // write allowed -> fail
            expect(false).toBe(true);
        } catch(error) {
            // write denied -> pass
            expect(true).toBe(true);
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
        // store functions
        const docRef = db.collection(FUNCTION_COLLECTION).doc(func.desc.functionName);
        await docRef
        .set(func.desc)
        .catch((error) => {
            console.error('Error adding document: ', error);
        });
        
        // store parameters
        for (const param of func.parameters) {
            await db.collection(FUNCTION_COLLECTION)
            .doc(func.desc.functionName)
            .collection(PARAMETER_COLLECTION)
            .doc(param.parameterName)
            .set(param)
            .catch((error) => {
                console.error('Error adding document to subcollection: ', error);
            });
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
        // store visual properties
        const docRef = db.collection(VISUAL_PROPERTY_COLLECTION).doc(visualProperty.desc.name);
        await docRef
        .set(visualProperty.desc)
        .catch((error) => {
            console.error('Error adding document: ', error);
        });
        
        // store data types
        for (const type of visualProperty.dataTypes) {
            await db.collection(VISUAL_PROPERTY_COLLECTION)
            .doc(docRef.id)
            .collection(DATATYPE_COLLECTION)
            .doc(type.dataType)
            .set(type)
            .catch((error) => {
                console.error('Error adding document to subcollection: ', error);
            });
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
        // store visual properties
        const docRef = db.collection(DOMAIN_COLLECTION).doc(domain.name);
        await docRef
        .set(domain)
        .catch((error) => {
            console.error('Error adding document: ', error);
        });
    }
}


/**
 * This function load test data into the emulator firestore using admin SDK
 */
async function loadTestData() {
    try {
        // retrieve service Account
        let serviceAccount;
        // running tests locally -> need to download a Firebase Admin SDK credential
        if ( CI_ADMIN_CREDENTIAL === undefined) {
            serviceAccount = require(LOCAL_ADMIN_CREDENTIAL); 
        } else {
            // running tests through CI
            serviceAccount = JSON.parse(CI_ADMIN_CREDENTIAL);
        }

        // Initialize admin Firebase with the emulator configuration
        process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; 
        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        
        // Get a Firestore instance from Firebase
        const db = admin.firestore(app);
        
        // write test data into database
        await storeFunc(TEST_FUNCTIONS_VALID, db);
        await storeProperties(TEST_VISUAL_PROPERTY, db);
        await storeDomain(TEST_DOMAIN_VALID, db);
        
        // close the admin app and firestore
        delete process.env.FIRESTORE_EMULATOR_HOST;
        admin.app().delete();
    } catch (error) {
        console.error('Admin firestore Error:', error);
    }
}
