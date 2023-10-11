import {
    getYouTubeEmbedding,
    formatString,
    wrapTextInCode,
    wrapTextInParagraph,
    createImage
} from "./general-util.js"

const FUNC_NAME_ELEM = "function-name";
const FUNC_DESC_ELEM = "description";
const FUNC_PARAMS_ELEM = "parameter";
const FUNC_EG_ELEM = "example";
const VIDEO_DEMO_ELEM = ".video-demo-container";
const CODE_DEMO_ELEM = "code-demo";
const VIDEO_EXPLANATION_ELEM = "video-explanation";
const FUNC_DEMO_DIV = '.demo';
const FUNC_PARAMS_DIV = '.params';
const PAGE_CONTENT_CLASS = ".page-content";
/* For the not functioning warning */
const NOT_AVAILABLE = "Currently unavailable.";
const NF_WARNING_CLASS = 'non-functioning-warning';
const NF_WARNING_CONTAINER_CLASS = 'not-functioning-warning-container';
const NF_WARNING_CONTAINER_IMG = "/assets/resources/not-functioning-warning-container.png";
const NF_WARNING_MSG = "&#9888; This function is currently not functioning.";

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
    const parameterElem = document.getElementById(FUNC_PARAMS_ELEM);
    if (querySnapshot == null) {
        parameterElem.textContent = NOT_AVAILABLE;
        return;
    }

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

        parameterElem.appendChild(li);
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
    if (!videoSrc)  return;
    const videoContainer = document.querySelector(VIDEO_DEMO_ELEM);
    videoContainer.innerHTML = getYouTubeEmbedding(videoSrc);
    videoContainer.style['display'] = 'inline-block';
}

/**
 * Adds the code demo for the function.
 * @param code: a string representing the code demo contents
 * @returns {HTMLElement}: an HTML element representing the filled code block
 */
function addCodeDemo(code) {
    const codeBlock = document.getElementById(CODE_DEMO_ELEM);
    codeBlock.setTextContent(formatString(code));
    codeBlock.style['display'] = 'inline-block';
    codeBlock.style['max-width'] = '47%';
    return codeBlock;
}

/**
 * Fills in the paragraph element with the video explanation.
 * @param text: a string representing the video explanation
 */
function addVideoExplanation(text) {
    const p = document.getElementById(VIDEO_EXPLANATION_ELEM);
    p.textContent = text;
}

/**
 * Wrapper function to add the code demo, video demo and video explanation at once
 * @param code: a string representing the code demo contents
 * @param videoSrc: a string representing the url of the video
 * @param videoExplanation: a string representing the video explanation
 */
function addDemo(code, videoSrc, videoExplanation) {
    addVideoDemo(videoSrc);
    let codeDemo = addCodeDemo(code);
    codeDemo.style['float'] = (videoSrc === undefined) ? 'none' : 'right';
    addVideoExplanation(videoExplanation);
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
    if (docData.notFunctioning) {
        addNotFunctioningWarning(docData.functionName);
        return;
    }

    addDemo(docData.videoCode, docData.youtubeEmbeddingLink, docData.videoExplanation);
}

/**
 * Adds the function not functioning warning,
 * and displays the relevant content as unavailable.
 */
function addNotFunctioningWarning() {
    // add the warning
    let parentDiv = document.querySelector(PAGE_CONTENT_CLASS);
    let paramsDiv = document.querySelector(FUNC_PARAMS_DIV);
    parentDiv.insertBefore(createNotFunctioningWarning(), paramsDiv);

    // set parameter and demo as N/A
    let demoDiv = document.querySelector(FUNC_DEMO_DIV);
    demoDiv.appendChild(wrapTextInParagraph(NOT_AVAILABLE));
    document.getElementById(CODE_DEMO_ELEM).hidden = true;
    paramsDiv.appendChild(wrapTextInParagraph(NOT_AVAILABLE));
}

/**
 * Creates the function not functioning warning.
 * @returns {HTMLDivElement}: a HTML `div` element wrapping the warning.
 */
function createNotFunctioningWarning() {
    // wrapper div
    let warningDiv = document.createElement('div');
    warningDiv.className = NF_WARNING_CLASS;

    // background image
    warningDiv.appendChild(createImage(
        NF_WARNING_CONTAINER_IMG,
        NF_WARNING_CONTAINER_CLASS,
        NF_WARNING_CONTAINER_CLASS
    ));

    // warning message
    let msg = document.createElement('p');
    msg.innerHTML = NF_WARNING_MSG;

    warningDiv.appendChild(msg);
    return warningDiv;
}