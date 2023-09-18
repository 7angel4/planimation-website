const DOMAIN_NAME_ID = "domain-name";
const DOMAIN_DESC_ID = "domain-desc";
const EDITOR_ID = "pddl-editor";
const GITHUB_BTN_ID = "view-source-code";
const PLANIMATION_BTN = "#planimationMenuItem > a";

function addTitle(domainName) {
    const title = document.getElementById(DOMAIN_NAME_ID);
    title.textContent = domainName;
}

function addDescription(domainDesc) {
    const desc = document.getElementById(DOMAIN_DESC_ID);
    desc.textContent = domainDesc;
}

function addAnimation(sessionLink) {
    const editor = document.getElementById(EDITOR_ID);
    editor.src = sessionLink;
    editor.onload = () => {autoOpenPlanimation(sessionLink)};
}

export function autoOpenPlanimation(sessionLink) {
    const pddlEditor = document.getElementById(EDITOR_ID);
    pddlEditor.contentWindow.document.querySelector(PLANIMATION_BTN).click();
}

function addButton(id, text, ref) {
    const btn = document.getElementById(id);
    btn.type = 'button';
    btn.addEventListener('click', function(event) {
        window.location.href = ref;
    });
}

export function addData(doc) {
    const docData = doc.data();
    addTitle(docData.name);
    addDescription(docData.description);
    addAnimation(docData.sessionLink);
    addButton(GITHUB_BTN_ID, "View source code", docData.githubLink);
}