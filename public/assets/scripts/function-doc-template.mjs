const FUNC_NAME_ELEM = "function-name";
const FUNC_DESC_ELEM = "description";
const FUNC_PARAMS_ELEM = "parameters";
const FUNC_EG_ELEM = "example";
const VIDEO_DEMO_ELEM = ".video-demo-container";
const CODE_DEMO_ELEM = "code-demo";
const VIDEO_EXPLANATION_ELEM = "video-explanation";

import { getYouTubeEmbedding, formatString } from "./util.js"

/**
 * Adds a title to the page, which is the provided function name
 * @param functionName: a function name representing the heading of this screen
 */
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
 * @param querySnapshot: an array of Parameter objects, returned from the DB query
 */
export function addParams(querySnapshot) {
    const parameters = document.getElementById(FUNC_PARAMS_ELEM);
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const li = document.createElement("li");
        // wrap parameter name in code style
        const paramName = document.createElement("code");
        paramName.textContent = docData.parameterName;

        const paramDefaultVal = document.createElement("p");
        paramDefaultVal.textContent = "Default value: " + docData.defaultValue;
        const paramDesc = document.createElement("p");
        paramDesc.textContent = docData.explanation;

        li.appendChild(paramName);
        li.appendChild(paramDefaultVal);
        li.appendChild(paramDesc);

        parameters.appendChild(li);
    });
}

function addExample(exampleCode) {
    const example = document.getElementById(FUNC_EG_ELEM);
    example.setTextContent(exampleCode);
}

function addVideoDemo(videoSrc) {
    if (videoSrc === undefined)  return;
    const videoContainer = document.querySelector(VIDEO_DEMO_ELEM);
    videoContainer.innerHTML = getYouTubeEmbedding(videoSrc);
    videoContainer.style["display"] = "inline-block";
}

function addCodeDemo(code, videoSrc) {
    const codeBlock = document.getElementById(CODE_DEMO_ELEM);
    codeBlock.setTextContent(formatString(code));
    codeBlock.style["display"] = "inline-block";
    codeBlock.style["float"] = (videoSrc === undefined) ? "none" : "right";
    codeBlock.style["max-width"] = '50%';
}

function addVideoExplanation(text) {
    const p = document.getElementById(VIDEO_EXPLANATION_ELEM);
    p.textContent = text;
}

/**
 * Add the string fields of the doc object to the HTML document
 * @param doc: an object containing multiple fields
 */
export function addData(doc) {
    const docData = doc.data();
    addTitle(docData.functionName);
    addDescription(docData.briefDescription);
    addExample(docData.example);
    addVideoDemo(docData.youtubeEmbeddingLink);
    addCodeDemo(docData.videoCode, docData.youtubeEmbeddingLink);
    addVideoExplanation(docData.videoExplanation);
}
