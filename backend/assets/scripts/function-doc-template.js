function addTitle(functionName) {
    const title = document.getElementById("function-name");
    const content = document.createElement("code");
    content.textContent = functionName;
    title.appendChild(content);
}

function addDescription(desc) {
    const description = document.getElementById("description");
    description.textContent = desc;
}

/**
 * Add parameters
 * @param paramsList: an array of Parameter objects, returned from the DB query
 */
function addParams(paramsList) {
    const parameters = document.getElementById("parameters");
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
    const example = document.getElementById("example");
    example.textContent = exampleCode;
}

function addVideoDemo(videoSrc) {
    const video = document.getElementById("video-demo");
    const content = document.createElement("source");
    content.type = "video/mp4";
    content.src = videoSrc;
    video.appendChild(content);
}

function addCodeDemo(code) {
    const codeSnippet = document.getElementById("code-demo");
    codeSnippet.textContent = code;
}


/* DB Querying */
import { initialize } from 'backend/assets/scripts/fetch-firebase.js';
import { collection, query, where, getDocs } from "firebase/firestore";

const db = initialize();

async function fetchFunctionDoc(functionName) {
    const q = query(collection(db, "documentation"), where("name", "==", functionName));
    return await getDocs(q);
}
