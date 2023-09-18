import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { addData } from "./gallery-block-template.mjs";
import { autoOpenPlanimation } from "./gallery-block-template.mjs";
import { hideHeadBannerElements } from "./util.js";

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
const CHILD_DIR = "/gallery/";


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
    link.href = CHILD_DIR + domainName;
    link.dataset.type = "domain";

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
    // Check if the clicked link is a function link
    if (event && event.target.dataset.type !== "domain") {
        return;
    }
    // Extract the domainName from the URL path
    const pathSegments = window.location.pathname.split('/');
    const domainName = pathSegments[pathSegments.length - 1];

    // Fetch the domain content from Firestore based on domainName
    db.collection("animation").where("name", "==", domainName).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
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
    hideHeadBannerElements()

    // Swap the content div
    GALLERY_DIV.innerHTML =
        `
        <h1 id="domain-name"></h1>
        <div class="domain-desc"><p id="domain-desc"></p></div>
        <div class="animation-container"><iframe id="pddl-editor" width="100%" height="100%"></iframe></div>
        <button class="btn" id="view-source-code"></button>
        <button class="btn" onclick="window.location.href='/gallery.html'" type='button'>Return</button>
        `;
    document.body.onLoad = addData(doc);
}

function changePageDisplay() {
    GALLERY_DIV.style.display = "block";
    GALLERY_DIV.style.margin = "70px auto";
}

window.onload = function() {
    // Check if the URL path contains "/gallery/"
    if (window.location.pathname.includes(CHILD_DIR)) {
        loadDomainContent();
    }
};
