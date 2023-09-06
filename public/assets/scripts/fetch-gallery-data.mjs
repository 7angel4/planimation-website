import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {addData} from "./function-doc-template.mjs";

const firebaseConfig = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};

const GALLERY_CONTENT_ELEM = ".gallery";

initializeApp(firebaseConfig);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firestore
const db = firebase.firestore();

fetchAnimations();

function loadDomainContent(doc) {
    const domainTemplate =
        `
        <h1 id="domain-name"></h1>
        <p class="domain-desc"></p>
        <div class="animation-container"><video></video></div>
        <div class="file-buttons">
            <button class="view-btn" id="view-domain-file"></button>
            <button class="view-btn" id="view-problem-file"></button>
            <button class="view-btn" id="view-animation-profile"></button>
            <button id="src-code-btn"></button>
        </div>
        `

    const contentDiv = document.querySelector(GALLERY_CONTENT_ELEM);
    // Swap the content div
    contentDiv.innerHTML = domainTemplate;
    document.body.onLoad = addData(doc);
}