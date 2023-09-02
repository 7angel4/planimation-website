const HTML_FUNC_DOC_TEMPLATE =
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <link rel="stylesheet" type="text/css" href="../assets/stylesheets/master.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/stylesheets/function-doc-style.css"/>
        <script src="../assets/scripts/reusable-elements.js"></script>
        <script src="../assets/scripts/function-doc-template.js"></script>
    </head>
    <body>
        <!-- Header (function name) -->
        <header>
            <nav-bar></nav-bar>
            <h1 id="function-name"></h1>
            <script id="add-title">addTitle("distributex");</script>
        </header>
    
        <div class="page-content">
            <!-- General description -->
            <div class="description"><p id="description"></p></div>
            <!-- Parameters -->
            <div class="params">
                <h2>Parameters</h2>
                <ul id="parameters"></ul>
                <script>
                    addParams(fetchFunctionDoc("distributex").params); <!--?????-->
                </script>
            </div>
            <!-- Example usage -->
            <div class="example">
                <h2>Example</h2>
                <code id="example"></code>
                <script>
                    let example = "(assign (?obj x) (function distributex (objects ?obj) (settings (spacebtw 40))))";
                    addExample(example); <!--?????-->
                </script>
            </div>
            <div class="demo">
                <!-- Video demo -->
                <h2>Visual Demo</h2>
                <div class="video-container">
                    <video width="320" height="240" controls id="video-demo"></video>
                </div>
                <!-- Code snippet -->
                <code id="code-demo"></code>
                <script>
                    let doc = fetchFunctionDoc("distributex");
                    addExample(doc.VideoExplanation); <!--?????-->
                    addExample(doc.VideoCode);
                </script>
            </div>
        </div>
    
        <main-footer></main-footer>
    </body>
    </html>
    `

const FUNC_NAME_ELEM = "function-name";
const FUNC_DESC_ELEM = "description";
const FUNC_PARAMS_ELEM = "parameters";
const FUNC_EG_ELEM = "example";
const VIDEO_DEMO_ELEM = "video-demo";
const CODE_DEMO_ELEM = "code-demo";
const FUNC_DOC_HTML_PATH = "../../webpages/function-documentations/"
const getHTMLFilename = (functionName) => FUNC_DOC_HTML_PATH + functionName;

function addTitle(functionName) {
    const title = document.getElementById(FUNC_NAME_ELEM);
    const content = document.createElement("code");
    content.textContent = functionName;
    title.appendChild(content);
}

function addDescription(desc) {
    const description = document.getElementById(FUNC_DESC_ELEM);
    description.textContent = desc;
}

/**
 * Add parameters
 * @param paramsList: an array of Parameter objects, returned from the DB query
 */
function addParams(paramsList) {
    const parameters = document.getElementById(FUNC_PARAMS_ELEM);
    paramsList.forEach(
        param => {
            const li = document.createElement("li");
            // wrap parameter name in code style
            const paramName = document.createElement("code");
            paramName.textContent = param.Parameter;

            const paramDefaultVal = document.createElement("p");
            paramDefaultVal.textContent = "Default value: " + param.DefaultValue;
            const paramDesc = document.createElement("p");
            paramDesc.textContent = param.Explanation;

            li.appendChild(paramName);
            li.appendChild(paramDefaultVal);
            li.appendChild(paramDesc);

            parameters.appendChild(li);
        }
    )
}

function addExample(exampleCode) {
    const example = document.getElementById(FUNC_EG_ELEM);
    example.textContent = exampleCode;
}

function addVideoDemo(videoSrc) {
    const video = document.getElementById(VIDEO_DEMO_ELEM);
    const content = document.createElement("source");
    content.type = "video/mp4";
    content.src = videoSrc;
    video.appendChild(content);
}

function addCodeDemo(code) {
    const codeSnippet = document.getElementById(CODE_DEMO_ELEM);
    codeSnippet.textContent = code;
}

function createFunctionDoc(doc) {
    // retrieved data from DB
    const docData = doc.data();

    // create new HTML file
    const fs = require('fs');
    fs.writeFile(getHTMLFilename(doc.functionName), HTML_FUNC_DOC_TEMPLATE, (err) => {
        if (err) throw err;
        else {
            console.log("File updated with given data");
        }
    });


}


/* DB Querying */
import { initialize } from 'assets/scripts/fetch-firebase.js';
import { collection, query, where, getDocs } from "firebase/firestore";

const db = initialize();

async function fetchFunctionDoc(functionName) {
    const q = query(collection(db, "documentation"), where("name", "==", functionName));
    return await getDocs(q);
}
