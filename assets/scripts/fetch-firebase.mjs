import { addData, addParams } from "./function-doc-template.mjs";
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

fetchDocumentList();

// Fetch list of documents from Firestore
function fetchDocumentList() {
    db.collection("functions").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            createFunctionRef(doc);
        });
    }).catch((error) => {
        console.error("Error fetching document list: ", error);
    });
}

function createFunctionRef(doc) {
    let functionName = doc.data().functionName;
    let functionDescription = doc.data().briefDescription;

    const contentParent = document.querySelector(TABLE_CONTENT_ELEM);
    const tr = document.createElement('tr');
    //tr.class = "row-odd";
    const td = document.createElement('td');
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.class = "reference internal";
    a.href = "#"; // Placeholder href;
    a.addEventListener('click', loadDocumentContent);
    const code =  document.createElement('code');
    code.class="table-keyword";
    code.textContent = functionName;
    code.dataset.docId = doc.id;  // Store the document ID as a data attribute

    a.appendChild(code);
    p.appendChild(a);
    td.appendChild(p);
    tr.appendChild(td);

    const descriptionTd = document.createElement('td');
    const descriptionP = document.createElement('p');
    descriptionP.textContent = functionDescription;
    descriptionTd.appendChild(descriptionP);
    tr.appendChild(descriptionTd);

    contentParent.appendChild(tr);
}

function loadDocumentContent(event) {
    event.preventDefault(); // Prevent the default link behavior
    const docId = event.target.dataset.docId; // Get the document ID from the data attribute

    // Fetch the function content from Firestore
    db.collection("functions").doc(docId).get().then((doc) => {
        if (doc.exists) {
            loadFunctionDoc(doc);
            loadParams(docId);
        } else {
            console.error("Function not found!");
        }
    }).catch((error) => {
        console.error("Error fetching function content: ", error);
    });
}

function loadFunctionDoc(doc) {
    const functionDocTemplate =
        `
        <h1 id="function-name"></h1>
        <!-- General description -->
        <div class="description">
            <p id="description"></p>
        </div>
        <!-- Parameters -->
        <div class="params">
            <h2>Parameters</h2>
            <ul id="parameters"></ul>
        </div>
        <!-- Example usage -->
        <div class="example">
            <h2>Example</h2>
            <code id="example"></code>
        </div>
        <div class="demo">
            <!-- Video demo -->
            <h2>Visual Demo</h2>
            <div class="video-container">
                <video width="320" height="240" controls id="video-demo"></video>
            </div>
            <!-- Code snippet -->
            <code id="code-demo"></code>
        </div>
    `
    const contentDiv = document.querySelector(PAGE_CONTENT_ELEM);
    // Swap the content div
    contentDiv.innerHTML = functionDocTemplate;
    document.body.onLoad = addData(doc);
}



function loadParams(docId) {
    console.log("hi");
    return new Promise((resolve, reject) => {
        db.collection("functions").doc(docId).collection("parameters").get().then((querySnapshot) => {
            addParams(querySnapshot);
            resolve(); // Resolve the promise when done
        }).catch((error) => {
            console.error("Error fetching parameters: ", error);
            reject(error); // Reject the promise on error
        });
    });
}


function searchDocuments() {
    const searchTerm = document.getElementById('searchInput').value;
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = ""; // Clear the content

    // Query Firestore for documents with titles that start with the search term
    db.collection("functions")
        .where("functionName", ">=", searchTerm)
        .where("functionName", ">=", searchTerm + "\uf8ff")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                contentDiv.innerHTML = "No documents found for the search term.";
                return;
            }

            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                const docLink = document.createElement('a');
                docLink.textContent = docData.functionName;
                docLink.href = "#"; // Placeholder href
                docLink.dataset.docId = doc.id; // Store the document ID as a data attribute
                docLink.addEventListener('click', loadDocumentContent); // Add click event listener
                contentDiv.appendChild(docLink);
                contentDiv.appendChild(document.createElement('br')); // Line break for readability
            });
        })
        .catch((error) => {
            console.error("Error searching documents: ", error);
        });
}
