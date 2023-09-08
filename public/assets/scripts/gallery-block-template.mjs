import { getYouTubeEmbedding } from "./util.js";

const DOMAIN_NAME_ID = "domain-name";
const DOMAIN_DESC_CLASS = ".domain-desc";
const ANIMATION_CLASS = ".animation-container";
const GITHUB_BTN_ID = "view-source-code";
const EDITOR_BTN_ID = "view-on-PDDL-editor";

function addTitle(domainName) {
    const title = document.getElementById(DOMAIN_NAME_ID);
    title.textContent = domainName;
}

function addDescription(domainDesc) {
    const desc = document.querySelector(DOMAIN_DESC_CLASS);
    desc.textContent = domainDesc;
}

function addAnimation(domainName) {
    const container = document.querySelector(ANIMATION_CLASS);
    container.innerHTML = getYouTubeEmbedding(domainName);
}

function addButton(id, text, ref) {
    const btn = document.getElementById(id);
    const link = document.createElement('a');
    link.href = ref;
    link.textContent = text;
    btn.appendChild(link);
}

export function addData(doc) {
    const docData = doc.data();
    addTitle(docData.name);
    addDescription(docData.description);
    // addAnimation(docData.youtubeLink);
    addButton(GITHUB_BTN_ID, "View source code", docData.githubLink);
    // addButton(EDITOR_BTN_ID, "View on PDDL Editor", docData.githubLink);
}