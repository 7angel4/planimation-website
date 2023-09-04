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
const galleryDiv = document.getElementById('gallery');


db.collection("functions").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const docLink = document.createElement('a');
        docLink.href = `/testing/${docData.functionName}`;
        docLink.innerText = docData.functionName;
        galleryDiv.appendChild(docLink);
        galleryDiv.appendChild(document.createElement('br'));
    });
});