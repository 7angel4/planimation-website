const DOMAIN_NAME_ID = "domain-name";
const DOMAIN_DESC_ID = "domain-desc";
const ANIMATION_CLASS = ".animation-container";
const GITHUB_BTN_ID = "view-source-code";

function addTitle(domainName) {
    const title = document.getElementById(DOMAIN_NAME_ID);
    title.textContent = domainName;
}

function addDescription(domainDesc) {
    const desc = document.getElementById(DOMAIN_DESC_ID);
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
    // btn.style.float = right;
}

export function addData(doc) {
    const docData = doc.data();
    addTitle(docData.name);
    addDescription(docData.description);
    addButton(GITHUB_BTN_ID, "View source code", docData.githubLink);
}