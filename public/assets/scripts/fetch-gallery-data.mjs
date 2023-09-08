import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { addData } from "./function-doc-template.mjs";

const firebaseConfig = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};

const GALLERY_CONTENT = document.querySelector(".gallery");
const ANIMATION_COLLECTION = "animation";

initializeApp(firebaseConfig);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firestore
const db = firebase.firestore();

// fetchAnimations();
//
// // Fetch list of documents from Firestore
// function fetchAnimations() {
//     db.collection(ANIMATION_COLLECTION).get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             createFunctionRef(doc);
//         });
//     }).catch((error) => {
//         console.error("Error fetching document list: ", error);
//     });
// }

export function loadDomainContent(event) {
    event.preventDefault(); // Prevent the default link behavior
    const docId = event.target.dataset.docId; // Get the document ID from the data attribute

    // Fetch the function content from Firestore
    db.collection("animation").doc(docId).get().then((doc) => {
        if (doc.exists) {
            loadDomainPage(doc);
        } else {
            console.error("Domain not found!");
        }
    }).catch((error) => {
        console.error("Error fetching domain content: ", error);
    });
}

function loadDomainPage(doc) {
    const domainTemplate =
        `
        <h1 id="domain-name"></h1>
        <p class="domain-desc"></p>
        <div class="animation-container"><video></video></div>
        <div class="file-buttons">
            <button id="view-source-code"></button>
            <button id="view-on-PDDL-editor"></button>
        </div>
        `

    // Swap the content div
    GALLERY_CONTENT.innerHTML = domainTemplate;
    document.body.onLoad = addData(doc);
}