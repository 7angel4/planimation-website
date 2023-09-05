const FUNC_NAME_ELEM = "function-name";
const FUNC_DESC_ELEM = "description";
const FUNC_PARAMS_ELEM = "parameters";
const FUNC_EG_ELEM = "example";
const VIDEO_DEMO_ELEM = ".video-demo-container";
const CODE_DEMO_ELEM = "code-demo";
const YOUTUBE_EMBEDDING_HTML =
    `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/Ee0ZWyQX9ZQ?si=Y4hANUQFWJwEv1Tj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    `

/**
 * Gets the HTML code to embed the specified YouTube video.
 * @param link: URL of the video demo on YouTube
 * @returns the HTML code required to embed the given YouTube video
 */
const getYouTubeEmbedding = (link) => {
    return `<iframe width="560" height="315" src=${link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
};

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
    const videoContainer = document.querySelector(VIDEO_DEMO_ELEM);
    videoContainer.innerHTML = getYouTubeEmbedding(videoSrc);
    videoContainer.style["display"] = "inline-block";
}

const formatString = (s) => { return s.replaceAll("\\n", "\r\n"); }

function addCodeDemo(code) {
    const codeBlock = document.getElementById(CODE_DEMO_ELEM);
    codeBlock.setTextContent(formatString(code));
    codeBlock.style["display"] = "inline-block";
    codeBlock.style["float"] = "right";
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
    addVideoDemo("https://www.youtube.com/embed/Ee0ZWyQX9ZQ?si=G8zBaidLGb0VY5Eh");
    addCodeDemo(docData.videoCode);
}