const FUNC_NAME_ELEM = "function-name";
const FUNC_DESC_ELEM = "description";
const FUNC_PARAMS_ELEM = "parameters";
const FUNC_EG_ELEM = "example";
const VIDEO_DEMO_ELEM = "video-demo";
const CODE_DEMO_ELEM = "code-demo";
const FUNC_DOC_HTML_PATH = "../../webpages/function-documentations/"

function addTitle(functionName) {
    const title = document.getElementById(FUNC_NAME_ELEM);
    const content = document.createElement("code");
    content.textContent = functionName;
    title.appendChild(content);

    // add script
    const script = title.nextElementSibling;
    script.textContent = `addTitle(${functionName});`;
}

function addDescription(desc) {
    const description = document.getElementById(FUNC_DESC_ELEM);
    description.textContent = desc;

    // add script
    const script = description.nextElementSibling;
    script.textContent = `addDescription(${desc});`;
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
            paramName.textContent = param.parameterName;

            const paramDefaultVal = document.createElement("p");
            paramDefaultVal.textContent = "Default value: " + param.defaultValue;
            const paramDesc = document.createElement("p");
            paramDesc.textContent = param.explanation;

            li.appendChild(paramName);
            li.appendChild(paramDefaultVal);
            li.appendChild(paramDesc);

            parameters.appendChild(li);
        }
    );

    // add script
    const script = parameters.nextElementSibling;
    script.textContent = `addParams(${paramsList});`;
}

function addExample(exampleCode) {
    const example = document.getElementById(FUNC_EG_ELEM);
    example.textContent = exampleCode;

    // add script
    const script = example.nextElementSibling;
    script.textContent = `addExample(${exampleCode});`;
}

function addVideoDemo(videoSrc) {
    const video = document.getElementById(VIDEO_DEMO_ELEM);
    const content = document.createElement("source");
    content.type = "video/mp4";
    content.src = videoSrc;
    video.appendChild(content);

    // add script
    const script = video.nextElementSibling;
    script.textContent = `addVideoDemo(${videoSrc});`;
}

function addCodeDemo(code) {
    const codeSnippet = document.getElementById(CODE_DEMO_ELEM);
    codeSnippet.textContent = code;

    // add script
    const script = codeSnippet.nextElementSibling;
    script.textContent = `addCodeDemo(${code});`;
}

// to be called inside the function's doc page
export function addData(doc) {
    const docData = doc.data();
    addTitle(docData.functionName);
    addDescription(docData.briefDescription);
    addParams(docData.parameters);
    addExample(docData.example);
    addVideoDemo(docData.videoAddr);
    addCodeDemo(docData.videoCode);
}
