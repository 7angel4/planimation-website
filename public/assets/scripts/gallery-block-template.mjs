import { getYouTubeEmbedding } from "util.js";

const DOMAIN_NAME_ID = "domain-name";
const DOMAIN_DESC_CLASS = ".domain-desc";
const ANIMATION_CLASS = ".animation-container";
const VIEW_BTN_CLASS = ".view-btn";
const BTN_IDS = ["view-domain-file", "view-problem-file", "view-animation-profile", "src-code-btn"];
const BTN_TEXTS = ["View Domain file", "View Problem file", "View Animation Profile", "Download source code"];
const GITHUB_SRC_CODE_PATH = "https://github.com/planimation/documentation/tree/master/AnimationProfiles/";
const BTN_TEXTS = [];

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

function addButtons() {
    let n = BTN_IDS.length;
    for (let i = 0; i < n; i++) {
        addButton(BTN_IDS[i], BTN_TEXTS[i], BTN_REFS[i]);
    }
}

function addData(doc) {

}