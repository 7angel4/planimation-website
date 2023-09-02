const firebaseConfig = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF"
};

const CONTENT_ELEM = ".doc-table-content";

function initialize() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Firestore
    return firebase.firestore();
}


// Fetch list of documents from Firestore
function fetchDocumentList(db) {
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

    const contentParent = document.querySelector(CONTENT_ELEM);
    const tr = document.createElement('tr');
    //tr.class = "row-odd";
    const td = document.createElement('td');
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.class = "reference internal";
    a.href = "";
    a.title = functionName;
    const code =  document.createElement('code');
    code.class="table-keyword";
    code.textContent = functionName;
    a.dataset.docId = doc.id; // Store the document ID as a data attribute
    a.addEventListener('click', loadDocumentContent); // Add click event listener

    a.appendChild(code);
    p.appendChild(a);
    td.appendChild(p);
    tr.appendChild(td);

    const descriptionTd = document.createElement('td');
    const descriptionP = document.createElement('p');
    descriptionP.textContent = functionDescription;
    descriptionTd.appendChild(descriptionP);
    tr.appendChild(descriptionTd);

    contentParent.appendChild(a);
}

function loadDocumentContent(event) {
    event.preventDefault(); // Prevent the default link behavior

    const docId = event.target.dataset.docId; // Get the document ID from the data attribute

    // Clear the content div
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = "";

    // Fetch the function content from Firestore
    db.collection("functions").doc(docId).get().then((doc) => {
        if (doc.exists) {
            const docData = doc.data();

            // Display function name
            const funcName = document.createElement('h3');
            funcName.textContent = docData.functionName;
            contentDiv.appendChild(funcName);

            // Display example
            const example = document.createElement('pre'); // Using pre for code formatting
            example.textContent = "Example: " + docData.example;
            contentDiv.appendChild(example);

            // Display video code if it exists
            if(docData.videoCode) {
                const videoCode = document.createElement('pre');
                videoCode.textContent = "Video Code: " + docData.videoCode;
                contentDiv.appendChild(videoCode);
            }

            // Display video explanation if it exists
            if(docData.videoExplanation) {
                const videoExplanation = document.createElement('p');
                videoExplanation.textContent = "Video Explanation: " + docData.videoExplanation;
                contentDiv.appendChild(videoExplanation);
            }

            // Fetch and display parameters, then append the "Back to List" button
            displayParameters(docId, contentDiv).then(() => {
                // Add a "Back to List" button at the end
                const backButton = document.createElement('button');
                backButton.textContent = "Back to List";
                backButton.addEventListener('click', function() {
                    contentDiv.innerHTML = ""; // Clear the content
                    fetchDocumentList(); // Reload the list of functions
                });
                contentDiv.appendChild(backButton);
            });

        } else {
            console.error("Function not found!");
        }
    }).catch((error) => {
        console.error("Error fetching function content: ", error);
    });
}

function displayParameters(docId, contentDiv) {
    return new Promise((resolve, reject) => {
        db.collection("functions").doc(docId).collection("parameters").get().then((querySnapshot) => {
            querySnapshot.forEach((paramDoc) => {
                const paramData = paramDoc.data();

                const paramName = document.createElement('h4');
                paramName.textContent = paramData.parameterName;
                contentDiv.appendChild(paramName);

                const paramExplanation = document.createElement('p');
                paramExplanation.textContent = paramData.explanation;
                contentDiv.appendChild(paramExplanation);

                const paramDefault = document.createElement('p');
                paramDefault.textContent = "Default value: " + paramData.defaultValue;
                contentDiv.appendChild(paramDefault);
            });
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