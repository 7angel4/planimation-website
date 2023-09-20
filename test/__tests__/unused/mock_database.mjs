
// Import Firebase Firestore (replace with your actual import path)
const FirebaseTest = require('firebase-mock');

const FUNCTION_COLLECTION = "functions";
const ALIGN_MIDDLE = {
  functionName: 'align_middle',
  briefDescription: 'This function aligns obj1 to the middle of obj2.',
  category: 'other',
  example: '(equal (?obj1 x) (function align_middle (objects ?obj1 ?obj2)))',
  youtubeEmbeddingLink: 'https://www.youtube.com/embed/ziTAKykPj40?si=95t4ekKNAFpaOsAn',
  videoCode: '(:predicate boarded\n     :parameters (?person lift)\n     :custom lift\n     :effect(\n         (equal (?person y) (lift y))\n         (equal (?person x) (function align_middle (objects ?person lift)))\n     )\n)',
  videoExplanation: 'The function is used in the elevator domain when a passenger boards the lift. The passenger stands in the middle of the lift.'
};



describe('4.b1 view function list (successful)', () => {
  let db;
  let collectionRef;
  let insertedDocId;

  // initialise database
  beforeAll(async ()=>{
    try {
      // Create a Firebase mock instance
      const firebaseMock = new FirebaseTest.MockFirebaseSdk();
      console.log(1);

      // Get a Firestore instance from the mock
      db = firebaseMock.firestore();
      console.log(2);

      // Define the Firestore collection reference
      collectionRef = db.collection(FUNCTION_COLLECTION);
      console.log(3);

      // Use the mock Firestore instance to insert data
      const docRef = await collectionRef.add(ALIGN_MIDDLE);
      insertedDocId = docRef.id;
      console.log(4);
      
    } catch (error){
      console.error('Firestore Error:', error);
    }
  },5000);
  
  it('fetch align_middle from database', async () => {
    const FUNCTION_NAME_TEST = "align_middle";
    
    const querySnapshot = await collectionRef.where('functionName', '==', FUNCTION_NAME_TEST).get();
    expect(querySnapshot.size).toBe(1);

  });

  afterAll(async () => {
    try {
      if (insertedDocId) {
        await collectionRef.doc(insertedDocId).delete();
      }
    } catch (error) {
      console.error('Firestore Cleanup Error:', error);
    }
  });
});


