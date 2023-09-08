import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { addData } from "./gallery-block-template.mjs";

const firebaseConfig = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};

const GALLERY_DIV = document.querySelector("div.gallery");
const ANIMATION_COLLECTION = "animation";
const THUMBNAIL_PATH = "assets/resources/thumbnails/";


initializeApp(firebaseConfig);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firestore
const db = firebase.firestore();

fetchAnimations();

// Fetch list of documents from Firestore
function fetchAnimations() {
    db.collection(ANIMATION_COLLECTION).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            createGalleryItem(doc);
        });
    }).catch((error) => {
        console.error("Error fetching document list: ", error);
    });
}

/**
 * Returns the path of the thumbnail for the given domain.
 * @param domainName: a string representing the name of a domain
 * @returns {string}: the path to that domain's thumbnail
 */
const getThumbnail = (domainName) => { return THUMBNAIL_PATH + domainName + ".png"};
// const getWebpage = (domainName) => { return domainName + ".html" };

function createGalleryItem(domainDoc) {
    const domainName = domainDoc.data().name;
    let galleryItem = document.createElement('div');
    galleryItem.className = "gallery-item";
    let link = document.createElement('a');
    link.addEventListener('click', loadDomainContent);
    // link.dataset.docId = domainDoc.id;

    let thumbnail = document.createElement('img');
    thumbnail.className = "thumbnail";
    thumbnail.src = getThumbnail(domainName);
    thumbnail.alt = domainName;
    thumbnail.dataset.docId = domainDoc.id;

    let caption = document.createElement('span');
    caption.className = "caption";
    caption.textContent = domainName;
    caption.dataset.docId = domainDoc.id;

    link.appendChild(thumbnail);
    link.appendChild(caption)
    galleryItem.appendChild(link);
    GALLERY_DIV.appendChild(galleryItem);
}

export function loadDomainContent(event) {
    event.preventDefault(); // Prevent the default link behavior
    const docId = event.target.dataset.docId; // Get the document ID from the data attribute

    // Fetch the function content from Firestore
    db.collection("animation").doc(docId).get().then((doc) => {
        if (doc.exists) {
            loadDomainPage(doc);
            changePageDisplay();
        } else {
            console.error("Domain not found!");
        }
    }).catch((error) => {
        console.error("Error fetching domain content: ", error);
    });
}

function loadDomainPage(doc) {
    // Swap the content div
    GALLERY_DIV.innerHTML =
        `
        <h1 id="domain-name"></h1>
        <div class="domain-desc"><p id="domain-desc"></p></div>
        <div class="animation-container"><video></video></div>
        <div class="file-buttons">
            <button id="view-source-code"></button>
            <button id="view-on-PDDL-editor"></button>
        </div>
        `;
    document.body.onLoad = addData(doc);
}

function changePageDisplay() {
    GALLERY_DIV.style.display = "block";
    GALLERY_DIV.style.margin = "70px auto";
}