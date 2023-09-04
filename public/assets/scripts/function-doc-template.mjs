const FUNC_NAME_ELEM = "function-name";
const FUNC_DESC_ELEM = "description";
const FUNC_PARAMS_ELEM = "parameters";
const FUNC_EG_ELEM = "example";
const VIDEO_DEMO_ELEM = "video-demo";
const CODE_DEMO_ELEM = "code-demo";

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
    querySnapshot.forEach((paramDoc) => {
            const li = document.createElement("li");
            // wrap parameter name in code style
            const paramName = document.createElement("code");
            paramName.textContent = paramDoc.parameterName;

            const paramDefaultVal = document.createElement("p");
            paramDefaultVal.textContent = "Default value: " + paramDoc.defaultValue;
            const paramDesc = document.createElement("p");
            paramDesc.textContent = paramDoc.explanation;

            li.appendChild(paramName);
            li.appendChild(paramDefaultVal);
            li.appendChild(paramDesc);

            parameters.appendChild(li);
        }
    );
}

function addExample(exampleCode) {
    const example = document.getElementById(FUNC_EG_ELEM);
    example.setCodeContent(exampleCode);
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
    codeSnippet.setCodeContent(code);
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
    addVideoDemo(docData.videoAddr);
    addCodeDemo(docData.videoCode);
}
