import { readFunctionsFromDB, getFirestoreEmulator, readVisualPropertyFromDB, readDomainsFromDB} from './backend-test-util';
const {doc, setDoc} = require('firebase/firestore');
const PERMISSION_DENIED = 'permission-denied';

describe('Read from database', () => {
    let db;

    beforeAll(async () => {
        // initialise client emulator firestore
        db = await getFirestoreEmulator();
    });

    it('allow anyone to read from database', async () => {
        const databaseFunctions = await readFunctionsFromDB(db);
        const databaseVisualProperties = await readVisualPropertyFromDB(db);
        const databaseDomains = await readDomainsFromDB(db);
        expect(databaseFunctions.length).toBeGreaterThanOrEqual(1);
        expect(databaseVisualProperties.length).toBeGreaterThanOrEqual(1);
        expect(databaseDomains.length).toBeGreaterThanOrEqual(1);
    });

    it('disallow anyone to write to database', async () => {
        // attempt to write functions
        try{
            const docRef = doc(db, 'random', 'random'); 
            await setDoc(docRef, {random:'random'});
            // write allowed -> fail
            expect(false).toBe(true);
        } catch(error) {
            // write denied -> pass
            expect(error.code).toBe(PERMISSION_DENIED);
        }
    });

});

