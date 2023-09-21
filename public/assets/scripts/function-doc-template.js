const FUNC_NAME_ELEM = "function-name";
const FUNC_DESC_ELEM = "description";
const FUNC_PARAMS_ELEM = "parameters";
const FUNC_EG_ELEM = "example";
const VIDEO_DEMO_ELEM = ".video-demo-container";
const CODE_DEMO_ELEM = "code-demo";
const VIDEO_EXPLANATION_ELEM = "video-explanation";

import {getYouTubeEmbedding, formatString, wrapTextInCode, wrapTextInParagraph} from "./util.js"

/**
 * Adds a title to the page, which is the provided function name.
 * @param functionName: a function name representing the heading of this screen
 */
function addTitle(functionName) {
    const title = document.getElementById(FUNC_NAME_ELEM);
    const content = document.createElement('code');
    content.textContent = functionName;
    title.appendChild(content);
}

/**
 * Adds the provided description to the page.
 * @param desc: string representing the description of the function
 */
function addDescription(desc) {
    const description = document.getElementById(FUNC_DESC_ELEM);
    description.textContent = desc;
}

/**
 * Add parameters from the query snapshot to the unordered list placeholder.
 * @param querySnapshot: an array of Parameter objects, returned from the DB query
 */
export function addParams(querySnapshot) {
    const parameters = document.getElementById(FUNC_PARAMS_ELEM);
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const li = document.createElement("li");

        // wrap parameter name in code style
        const paramName = wrapTextInCode(docData.parameterName);
        const paramDefaultVal = wrapTextInParagraph("Default value: " + docData.defaultValue);
        const paramDesc = wrapTextInParagraph(docData.explanation);

        li.appendChild(paramName);
        li.appendChild(paramDefaultVal);
        li.appendChild(paramDesc);

        parameters.appendChild(li);
    });
}

/**
 * Adds the code example for the function.
 * @param exampleCode: a string representing the contents of the code example
 */
function addExample(exampleCode) {
    const example = document.getElementById(FUNC_EG_ELEM);
    example.setTextContent(exampleCode);
}

/**
 * Adds the video demo for the function.
 * @param videoSrc: a string representing the url of the video
 */
function addVideoDemo(videoSrc) {
    if (videoSrc === undefined)  return;
    const videoContainer = document.querySelector(VIDEO_DEMO_ELEM);
    videoContainer.innerHTML = getYouTubeEmbedding(videoSrc);
    videoContainer.style['display'] = 'inline-block';
}

/**
 * Adds the code demo for the function.
 * @param code: a string representing the code demo contents
 * @param videoSrc: a string representing the url of the video
 *                  - its presence determines where the code demo is to be placed
 */
function addCodeDemo(code, videoSrc) {
    const codeBlock = document.getElementById(CODE_DEMO_ELEM);
    codeBlock.setTextContent(formatString(code));
    codeBlock.style['display'] = 'inline-block';
    codeBlock.style['float'] = (videoSrc === undefined) ? 'none' : 'right';
    codeBlock.style['max-width'] = '50%';
}

/**
 * Fills in the paragraph element with the video explanation.
 * @param text: represents the video explanation.
 */
function addVideoExplanation(text) {
    const p = document.getElementById(VIDEO_EXPLANATION_ELEM);
    p.textContent = text;
}

/**
 * Adds the string fields of the document to the HTML document.
 * @param doc: an object containing multiple fields
 */
export function addData(doc) {
    const docData = doc.data();
    addTitle(docData.functionName);
    addDescription(docData.briefDescription);
    addExample(docData.example);

    // if this function is non-functioning, add a warning
    if (docData.nonFunctioning) {
        addNotFunctioningWarning(docData.functionName);
        return;
    }

    addVideoDemo(docData.youtubeEmbeddingLink);
    addCodeDemo(docData.videoCode, docData.youtubeEmbeddingLink);
    addVideoExplanation(docData.videoExplanation);
}

function addNotFunctioningWarning(functionName) {

}