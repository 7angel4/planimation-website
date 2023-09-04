import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};

const TABLE_CONTENT_ELEM = ".doc-table-content";
const PAGE_CONTENT_ELEM = ".page-content";

initializeApp(firebaseConfig);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firestore
const db = firebase.firestore();

fetchAnimations();

function fetchAnimations() {
    const gallery = document.getElementById('animationGallery');

    // Clear existing animations
    gallery.innerHTML = '';

    db.collection("animation").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const animationData = doc.data();

            // Create a new animation div
            const animationDiv = document.createElement('div');
            animationDiv.className = 'animation';

            // Create the link element
            const animationLink = document.createElement('a');
            animationLink.href = animationData.link;
            animationLink.textContent = animationData.name;

            // Append the link to the animation div
            animationDiv.appendChild(animationLink);

            // Append the animation div to the gallery
            gallery.appendChild(animationDiv);
        });
    }).catch((error) => {
        console.error("Error fetching animations: ", error);
    });
}

function filterAnimations() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const gallery = document.getElementById('animationGallery');
    const animations = gallery.getElementsByClassName('animation');

    for (let i = 0; i < gallery.length; i++) {
        const a = gallery[i].getElementsByTagName('a')[0];
        const txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            gallery[i].style.display = "";
        } else {
            gallery[i].style.display = "none";
        }
    }
}