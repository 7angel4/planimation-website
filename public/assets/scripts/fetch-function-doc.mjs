import { addData, addParams } from "./function-doc-template.mjs";
import { addDataTypesToList, addCustomProperties } from "./properties-doc-template.mjs";
import { initializeFirestore } from "./fetch-data.js";
import {
    createTdWithP,
    wrapTextInCode,
    createTdWithElem,
    createTdWithCode,
    convertToMarkdown,
    hideHeaderAboveTitle
} from "./util.js";


const TABLE_CONTENT_CLASS = ".doc-table-content";
const PAGE_CONTENT_CLASS = ".page-content";
const FUNCTION_COLLECTION = "functions";
const CUSTOM_PROPERTY_COLLECTION = "customisedProperty";
const CUSTOM_PROPERTY_ID = "custom-properties";
const VISUAL_PROPERTY_COLLECTION = "visualProperty";
const DISTRIBUTE_FUNCTIONS_TABLE = "#distribute-functions " + TABLE_CONTENT_CLASS;
const OTHER_FUNCTIONS_TABLE = "#other-functions " + TABLE_CONTENT_CLASS;
const VISUAL_PROPERTY_ID = "visual-properties";
const VISUAL_PROPERTIES_TABLE = "#" + VISUAL_PROPERTY_ID + " " + TABLE_CONTENT_CLASS;
const DISTRIBUTE_FUNCTION_CATEGORY = "distribute";
const OTHER_FUNCTION_CATEGORY = "others";
const CHILD_DIR = "/documentation/";
const PAGE_CONTENT_DIV = document.querySelector(PAGE_CONTENT_CLASS);


const DB = initializeFirestore();


fetchDocFromCollection(FUNCTION_COLLECTION, createFunctionRef);
fetchDocFromCollection(VISUAL_PROPERTY_COLLECTION, createVisualPropertyRow);
fetchDocFromCollection(CUSTOM_PROPERTY_COLLECTION, addCustomProperties);

/**
 * Fetch documentation from Firestore for the given collection,
 * and performs the action on the documents
 * @param collectionName: name of the collection from which data is to be fetched.
 * @param action: action to be performed on the documents.
 */
function fetchDocFromCollection(collectionName, action) {
    DB.collection(collectionName).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            action(doc);
            convertToMarkdown();
        });
    }).catch((error) => {
        console.error("Error fetching documents for " + collectionName + ": ", error);
    });
}

/**
 * Creates a reference to the specified function's individual page.
 * @param doc: the document containing data for the function.
 */
function createFunctionRef(doc) {
    let docData = doc.data();
    let functionName = docData.functionName;
    let functionDescription = docData.briefDescription;
    const category = docData.category;

    const contentParent = getTableMatchingCategory(category);
    const tr = document.createElement('tr');

    // inside the td
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.class = "reference internal";
    a.href = CHILD_DIR + functionName;
    a.dataset.type = "function";
    const code =  document.createElement('code');
    code.className = "table-keyword";
    code.textContent = functionName;
    code.dataset.docId = doc.id;  // Store the document ID as a data attribute
    a.appendChild(code);
    p.appendChild(a);

    // assemble
    tr.appendChild(createTdWithElem(p));
    tr.appendChild(createTdWithP(functionDescription));
    contentParent.appendChild(tr);
}

/**
 * Gets the table matching the specified category.
 * @param category: string representing a function category (e.g. distribute / other functions)
 * @returns {Element}: the corresponding HTML `table` element
 */
const getTableMatchingCategory = (category) => {
    let tableSelector;
    switch (category) {
        case DISTRIBUTE_FUNCTION_CATEGORY:
            tableSelector = DISTRIBUTE_FUNCTIONS_TABLE;
            break;
        default:
            tableSelector = OTHER_FUNCTIONS_TABLE;
            break;
    }
    return document.querySelector(tableSelector);
}

function loadDocumentContent(event) {
    // Check if the clicked link is a function link
    if (event && event.target.dataset.type !== "function") {
        return;
    }
    // Extract the functionName from the URL path
    const pathSegments = window.location.pathname.split('/');
    const functionName = pathSegments[pathSegments.length - 1]; // Assuming the last segment is the functionName
    // Fetch the function content from Firestore
    DB.collection("functions").where("functionName", "==", functionName).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            loadFunctionDoc(doc);
            loadParams(doc.id);
        } else {
            console.error("Function not found!");
            window.location.href = "/404.html";
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
        <div class="description"><p id="description"></p></div>
        <!-- Parameters -->
        <div class="params">
            <h3>Parameters</h3>
            <ul id="parameters"></ul>
        </div>
        <!-- Example usage -->
        <div class="example">
            <h3>Example</h3>
            <code-block id="example"></code-block>
        </div>
        <div class="demo">
            <!-- Video demo -->
            <h3>Demo</h3>
            <div class="video-demo-container"></div>
            <!-- Code snippet -->
            <code-block id="code-demo"></code-block>
            <p id="video-explanation"></p>
        </div>
        <button class="btn return" onclick="window.location.href='/documentation.html'" type='button'>Return</button>
    `
    // Swap the content div
    PAGE_CONTENT_DIV.innerHTML = functionDocTemplate;
    document.body.onLoad = addData(doc);
    hideHeaderAboveTitle(PAGE_CONTENT_DIV);
}


/**
 * Loads information from the parameters document.
 * @param docId: ID of the document to be fetched
 * @returns {Promise<unknown>}
 */
function loadParams(docId) {
    return new Promise((resolve, reject) => {
        DB.collection(FUNCTION_COLLECTION).doc(docId).collection("parameters").get().then((querySnapshot) => {
            addParams(querySnapshot);
            resolve(); // Resolve the promise when done
        }).catch((error) => {
            console.error("Error fetching parameters: ", error);
            reject(error); // Reject the promise on error
        });
    });
}

/**
 * Loads information from the data types document to the provided list element.
 * @param docId: ID of the document to be fetched
 * @param list: an HTML `ul` element which holds the list of data types
 * @returns {Promise<unknown>}
 */
function loadDataTypes(docId, list) {
    return new Promise((resolve, reject) => {
        DB.collection(VISUAL_PROPERTY_COLLECTION).doc(docId).collection("dataType").get().then((querySnapshot) => {
            addDataTypesToList(querySnapshot, list);
            resolve(); // Resolve the promise when done
        }).catch((error) => {
            console.error("Error fetching data types: ", error);
            reject(error); // Reject the promise on error
        });
    });
}

/**
 * Creates a row in the visual property documentation table.
 * @param doc: Firebase document containing the data to fill the row.
 */
function createVisualPropertyRow(doc) {
    const docData = doc.data();
    const contentParent = document.querySelector(VISUAL_PROPERTIES_TABLE);

    // row header
    const tr = document.createElement('tr', 'table-keyword');
    const nameTd = createTdWithCode(docData.name);

    // row body
    const descriptionTd = createTdWithP(docData.description);
    const typeTd = createTdWithP(docData.type);

    // data types are compulsory
    const dataTypeList = document.createElement('ul');
    loadDataTypes(doc.id, dataTypeList);
    const dataTypeTd = createTdWithElem(dataTypeList);

    const additionalList = document.createElement('ul');
    const additionalTd = createTdWithElem(additionalList);

    let note, defaultVal;
    if (docData.note === undefined && docData.defaultValue === undefined) {
        additionalTd.style['background-color'] = '#ecf2f6';
    } else if (docData.note === undefined && docData.defaultValue !== undefined) {
        // defaultValue only
        defaultVal = document.createElement('li');
        defaultVal.textContent = "Default value: ";
        defaultVal.appendChild(wrapTextInCode(docData.defaultValue));
        additionalList.appendChild(defaultVal);
    } else if (docData.defaultValue === undefined && docData.note !== undefined) {
        // note only
        note = document.createElement('li');
        note.textContent = docData.note;
        additionalList.appendChild(note);
    } else {
        // both
        defaultVal = document.createElement('li');
        note = document.createElement('li');
        defaultVal.textContent = docData.defaultValue;
        note.textContent = docData.note;
        additionalList.appendChild(defaultVal);
        additionalList.appendChild(note);
    }

    // add the entries into the row
    tr.appendChild(nameTd);
    tr.appendChild(typeTd);
    tr.appendChild(dataTypeTd);
    tr.appendChild(descriptionTd);
    tr.appendChild(additionalTd);

    contentParent.appendChild(tr);
}


window.onload = function() {
    // Check if the URL path contains "/documentation/"
    if (window.location.pathname.includes(CHILD_DIR)) {
        loadDocumentContent();
    }
    convertToMarkdown();
};