const firebase = require('@firebase/testing');
const PROJ_ID = 'planimation-staging-181bc';


describe("test reading", ()=> {
    it ("can read from functions collection", async ()=>{
        const db = firebase.initializeTestApp({projectId: PROJ_ID}).firestore();
        db.settings({ experimentalForceLongPolling: true });
        const testDoc = db.collection("functions").where('functionName', '==', 'align_middle');
        await firebase.assertSucceeds(testDoc.get());

        const docSnapshot = await testDoc.get();

    })
})