console.log("JavaScript file has started executing.");


const firebaseConfig = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firestore
const db = firebase.firestore();

// Get functionName from URL path
const pathSegments = window.location.pathname.split('/');
const functionName = pathSegments[pathSegments.length - 1];

// Fetch document from Firestore using functionName
db.collection("functions").where("functionName", "==", functionName).get().then((querySnapshot) => {
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            document.getElementById('briefDescription').innerText = docData.briefDescription;
            document.getElementById('category').innerText = docData.category;
            document.getElementById('example').innerText = docData.example;
        });
    } else {
        console.log("No documents found with the given functionName:", functionName);
    }
});

console.log("JavaScript file has finished executing.");
