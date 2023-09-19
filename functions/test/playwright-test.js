"use strict";

const { chromium } = require('playwright');
const assert = require('assert');
const { clickAndVerify, getRandomElem, clickAndVerifyLocation } = require("./playwright-test-util.js");

const INDEX_URL = "http://localhost:5004/";
const DOC_URL = INDEX_URL + "documentation";
const GALLERY_URL = INDEX_URL + "gallery";
const REF_URL = INDEX_URL + "references";
const SUGGESTIONS_URL = INDEX_URL + "suggestions";

const NAV_HOME = ".to-home";
const NAV_DOC = ".to-documentation";
const NAV_GALLERY = ".to-gallery";
const NAV_REF = ".to-references";
const NAV_SUGGESTIONS = ".to-suggestions";

const RETURN_BTN = ".return";
const EXPLORE_DOMAINS_BTN = ".explore-domains";
const VIEW_GITHUB_DOC_BTN = ".view-github-doc";
const GITHUB_DOC_REPO_URL = "https://github.com/planimation/documentation";
const GALLERY_SRC_CODE_BTN = ".view-ap-src-code";
const AP_SRC_CODE_URL = "https://github.com/planimation/documentation/tree/master/AnimationProfiles";
const DOMAIN_SRC_CODE_BTN = "#view-src-code";
const DOMAIN_SRC_CODE_URL_PREFIX = "https://github.com/planimation/documentation/tree/af1851dd6c679f554afa7bab88f7d37d56187c1b/AnimationProfiles/";
const LOGO_IMG = ".logo-img";


(async () => {
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await testIndex(page);
    await testDoc(page);
    await testGallery(page);
    await testReferences(page);
    await testSuggestions(page);

    await browser.close();
})();

async function testSuggestions(page) {
    await clickAndVerify(page, NAV_SUGGESTIONS, SUGGESTIONS_URL);
    await page.click("[target='_blank']");
    // return to home page
    await clickAndVerify(page, LOGO_IMG, INDEX_URL);
}

const REFERENCE_URLS = [
    {text: "Planimation Documentation on GitHub", url: "https://planimation.github.io/documentation/"},
    {text: "Planning.Domains", url: "https://planning.domains/"},
    {text: "Planning.Wiki", url: "https://planning.wiki/"},
    {text: "Planimation Visualiser", url: "https://planimation.planning.domains/problem"}
]

/**
 * Tests the references page.
 * @param page: the page to interact with
 * @returns {Promise<void>}
 */
async function testReferences(page) {
    await page.click(NAV_REF);
    assert.equal(page.url(), REF_URL);

    // check the list of URLs
    for (let i = 1; i <= REFERENCE_URLS.length; i++) {
        // check text display
        // check link
        await clickAndVerify(page, `.ref-list > :nth-child(${i}) [target='_blank']`, REFERENCE_URLS[i].text, REFERENCE_URLS[i].url);
    }
    await page.click(".ref-list > :nth-child(1) [target='_blank']");
    assert.equal(page.url(), REF_URL);
    await page.click(".ref-list > :nth-child(2) [target='_blank']");
    await page.click(".ref-list > :nth-child(3) [target='_blank']");
    await page.click(".ref-list > :nth-child(4) [target='_blank']");
}

const DOMAINS = ["Family-and-fisherman", "Visitall", "Grid"];
async function testGallery(page) {
    await clickAndVerify(page, NAV_GALLERY, "Gallery", GALLERY_URL);
    // click on "View source code of animation profiles" button in head banner
    await clickAndVerify(page, GALLERY_SRC_CODE_BTN, "View source code of animation profiles", AP_SRC_CODE_URL);

    // return to gallery
    await page.goto(GALLERY_URL);

    let chosenDomain = getRandomElem(DOMAINS);
    let expectedDomainUrl = GALLERY_URL + "/" + chosenDomain;
    await clickAndVerify(page, `[alt='${chosenDomain}']`, chosenDomain, expectedDomainUrl);

    // click "View Source Code" button
    await clickAndVerify(page, DOMAIN_SRC_CODE_BTN, DOMAIN_SRC_CODE_URL_PREFIX + chosenDomain);

    // return to gallery
    await page.goto(expectedDomainUrl);
    await testPddlEditorFrame(page);

    // return to gallery
    await clickAndVerify(page, RETURN_BTN, GALLERY_URL);
}

async function testPddlEditorFrame(page) {
    const pddlEditorLocator = page.frameLocator('#pddl-editor');
    // click on "Planimation" button in the menu
    await pddlEditorLocator.locator("#planimationMenuItem > a").click();
    // click on "Planimate" in the pop-up
    await pddlEditorLocator.locator("#filesChosenButton").click();
}

const FUNCTION_DOC_IDS = [
    {docId: "2JelRRGyOoOGXls6fXXB", functionName: "align_middle"},
    {docId: "6zeSOZbqnlMpo9wKLzLk", functionName: "distributey"},
    {docId: "FjBOvZOOv777pzPtDT9y", functionName: "draw_line"},
    {docId: "afGuuOwlb4iqoAEh57Ma", functionName: "distributex"}
];


/**
 * Tests the index page -- should start and end at the index page.
 * @param page
 * @returns {Promise<void>}
 */
async function testIndex(page) {
    await page.goto(INDEX_URL);
    // click on "Explore Domains" button
    await clickAndVerifyWithText(page, EXPLORE_DOMAINS_BTN, "EXPLORE DOMAINS", GALLERY_URL);
    // return to home page
    await clickAndVerify(page, NAV_HOME, "Home", INDEX_URL);
}

async function testDoc(page) {
    await clickAndVerify(page, NAV_DOC, "Documentation", DOC_URL);
    // click "View original GitHub documentation" button in head-banner
    await clickAndVerify(page, VIEW_GITHUB_DOC_BTN, "View original GitHub documentation", GITHUB_DOC_REPO_URL);
    // return to documentation page
    await page.goto(DOC_URL);
    // click into a random function's documentation page
    let chosenFunction = getRandomElem(FUNCTION_DOC_IDS);
    let expectedFunctionUrl = DOC_URL + "/" + chosenFunction.functionName;
    await clickAndVerify(page, `[data-doc-id='${chosenFunction.docId}']`, chosenFunction.functionName, expectedFunctionUrl);
    // play video
    await testYoutubeFrame(page);

    // click "Return" button - should return to documentation page
    await clickAndVerify(page, RETURN_BTN, DOC_URL);
}

async function testYoutubeFrame(page) {
    const playBtnLocator = page.frameLocator('.youtube-demo');
    await playBtnLocator.locator('.ytp-large-play-button').click();
}