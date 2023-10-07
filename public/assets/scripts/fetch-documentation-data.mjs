import { addData, addParams } from "./function-doc-util.js";
import { addDataTypesToList, addCustomProperties } from "./properties-doc-util.js";
import {
    fetchDocFromCollection,
    loadDocumentContent,
    fetchDocFromSubCollection
} from "./fetch-data.js";
import {
    createTdWithP,
    wrapTextInCode,
    createTdWithElem,
    createTdWithCode,
    createAnchor,
    createLiWithText,
    createLiWithCodeAndText,
    convertToMarkdown,
    hideHeaderAboveTitle
} from "./general-util.js";

const PAGE_CONTENT_CLASS = ".page-content";
const DOC_TABLE_CONTENT = ".doc-table-content";
const FUNCTION_COLLECTION = "function";
const PARAM_COLLECTION = "parameter";
const DATA_TYPE_COLLECTION = "dataType";
const CUSTOM_PROPERTY_COLLECTION = "customisedProperty";
const VISUAL_PROPERTY_COLLECTION = "visualProperty";
const DISTRIBUTE_FUNCTIONS_TABLE = "#distribute-functions " + DOC_TABLE_CONTENT;
const OTHER_FUNCTIONS_TABLE = "#other-functions " + DOC_TABLE_CONTENT;
const VISUAL_PROPERTY_ID = "visual-properties";
const VISUAL_PROPERTIES_TABLE = "#" + VISUAL_PROPERTY_ID + " " + DOC_TABLE_CONTENT;
const DISTRIBUTE_FUNCTION_CATEGORY = "distribute";
const CHILD_DIR = "/documentation/";
const PAGE_CONTENT_DIV = document.querySelector(PAGE_CONTENT_CLASS);
const EMPTY_TD_COLOR = '#ecf2f6';  /* gray out color for empty table cells */
const FORMAT_DEFAULT_VAL = "Default value: ";
const FUNCTION_TABLE_KEYWORD = "function-table-keyword";

fetchDocFromCollection(FUNCTION_COLLECTION, createFunctionRef);
fetchDocFromCollection(VISUAL_PROPERTY_COLLECTION, createVisualPropertyRow);
fetchDocFromCollection(CUSTOM_PROPERTY_COLLECTION, addCustomProperties);

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
    const tableRow = document.createElement('tr');

    // hierarchy inside the table data entry: paragraph > anchor > code
    const p = document.createElement('p');
    const a = createAnchor(CHILD_DIR + functionName, '');
    a.class = "reference internal";
    a.dataset.type = "function";
    const code =  wrapTextInCode(functionName);
    code.className = FUNCTION_TABLE_KEYWORD;
    code.dataset.docId = doc.id;  // Store the document ID as a data attribute
    a.appendChild(code);
    p.appendChild(a);

    // assemble
    tableRow.appendChild(createTdWithElem(p));
    tableRow.appendChild(createTdWithP(functionDescription));
    contentParent.appendChild(tableRow);
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

/**
 * Loads the content of a function's document.
 */
function loadFunctionDocContent() {
    loadDocumentContent(
        FUNCTION_COLLECTION, 'function', 'functionName',
        (doc) => {
            loadFunctionDoc(doc);
            loadParams(doc.id);
        });
}

/**
 * Loads the document for each function (i.e. creates the individual function's page)
 * @param doc: document containing data for the function
 */
function loadFunctionDoc(doc) {
    // Swap the content div
    PAGE_CONTENT_DIV.innerHTML =
        `
        <h1 id="function-name"></h1>
        <!-- General description -->
        <div class="description"><p id="description"></p></div>
        <!-- Parameters -->
        <div class="params">
            <h3>Parameters</h3>
            <ul id="parameter"></ul>
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
        `;
    document.body.onLoad = addData(doc);
    hideHeaderAboveTitle(PAGE_CONTENT_DIV);
    convertToMarkdown();
}

/**
 * Loads information from the parameter document.
 * @param docId: ID of the document to be fetched
 */
function loadParams(docId) {
    fetchDocFromSubCollection(FUNCTION_COLLECTION, PARAM_COLLECTION, docId, addParams);
}

/**
 * Loads information from the data types document to the provided list element.
 * @param docId: ID of the document to be fetched
 * @param list: an HTML `ul` element which holds the list of data types
 * @returns {Promise<unknown>}
 */
function loadDataTypes(docId, list) {
    fetchDocFromSubCollection(VISUAL_PROPERTY_COLLECTION, DATA_TYPE_COLLECTION, docId,
        (querySnapshot) => { addDataTypesToList(querySnapshot, list); }
    );
}

/**
 * Creates a row in the visual property documentation table.
 * @param doc: Firebase document containing the data to fill the row.
 */
function createVisualPropertyRow(doc) {
    const docData = doc.data();
    const contentParent = document.querySelector(VISUAL_PROPERTIES_TABLE);

    // row header
    const tr = document.createElement('tr', FUNCTION_TABLE_KEYWORD);
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

    if (docData.note === undefined && docData.defaultValue === undefined) {
        additionalTd.style['background-color'] = EMPTY_TD_COLOR;
    } else if (docData.note === undefined && docData.defaultValue !== undefined) {
        // default value only
        additionalList.appendChild(createLiWithCodeAndText(docData.defaultValue, FORMAT_DEFAULT_VAL));
    } else if (docData.defaultValue === undefined && docData.note !== undefined) {
        // note only
        additionalList.appendChild(createLiWithText(docData.note));
    } else {
        // both
        additionalList.appendChild(createLiWithCodeAndText(docData.defaultValue, FORMAT_DEFAULT_VAL));
        additionalList.appendChild(createLiWithText(docData.note));
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
        loadFunctionDocContent();
    }
};