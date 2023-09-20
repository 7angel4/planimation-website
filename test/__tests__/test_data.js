export const TEST_DATA_VALID = {
    functionName: 'align_middle',
    briefDescription: 'This function aligns obj1 to the middle of obj2.',
    category: 'other',
    example: '(equal (?obj1 x) (function align_middle (objects ?obj1 ?obj2)))',
    youtubeEmbeddingLink: 'https://www.youtube.com/embed/ziTAKykPj40?si=95t4ekKNAFpaOsAn',
    videoCode: '(:predicate boarded\n     :parameters (?person lift)\n     :custom lift\n     :effect(\n         (equal (?person y) (lift y))\n         (equal (?person x) (function align_middle (objects ?person lift)))\n     )\n)',
    videoExplanation: 'The function is used in the elevator domain when a passenger boards the lift. The passenger stands in the middle of the lift.'
    };

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF",
    databaseURL: "http://localhost:8080"
};