const firebaseConfig = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};

function initialize() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Firestore
    return firebase.firestore();
}

const db = initialize();

// Fetch documentation from Firestore and display it
function fetchDocumentation() {
    var db = initialize();
    const contentDiv = document.querySelector('.content');

    db.collection("documentation").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const docTitle = document.createElement('h3');
            docTitle.textContent = docData.title;
            contentDiv.appendChild(docTitle);

            const docContent = document.createElement('p');
            docContent.textContent = docData.content;
            contentDiv.appendChild(docContent);
        });
    }).catch((error) => {
        console.error("Error fetching documentation: ", error);
    });
}

function fetchDocumentationFor(func) {

}