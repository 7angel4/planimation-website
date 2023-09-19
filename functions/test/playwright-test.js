"use strict";

const { chromium } = require('playwright');
const assert = require('assert');
const { clickAndVerify, getRandomElem, clickAndVerifyLocation } = require("./playwright-test-util.js");

const INDEX_URL = "http://localhost:5004/";
const DOC_URL = INDEX_URL + "documentation";
const GALLERY_URL = INDEX_URL + "gallery";
const REF_URL = INDEX_URL + "references";
const SUGGESTIONS_URL = INDEX_URL + "suggestions";

const NAV_HOME = "nav .to-home";
const NAV_DOC = "nav .to-documentation";
const NAV_GALLERY = "nav .to-gallery";
const NAV_REF = "nav .to-references";
const NAV_SUGGESTIONS = "nav .to-suggestions";

const RETURN_BTN = ".return";
const RETURN_BTN_TEXT = "Return";
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
    // await testDoc(page);
    // await testGallery(page);
    await testReferences(page);
    // await testSuggestions(page);

    await browser.close();
})();

/**
 * Tests the suggestions page.
 * @param page: the page to interact with
 * @returns {Promise<void>}
 */
async function testSuggestions(page) {
    await clickAndVerify(page, NAV_SUGGESTIONS, "Suggestions", SUGGESTIONS_URL);
    await page.click("[target='_blank']");
    // return to home page
    await clickAndVerifyLocation(page, LOGO_IMG, INDEX_URL);
}

const REFERENCES = [
    {text: "Planimation Documentation on GitHub", url: "https://planimation.github.io/documentation/"},
    {text: "Planning.Domains", url: "http://api.planning.domains/"},
    {text: "Planning.Wiki", url: "https://planning.wiki/"},
    {text: "Planimation Visualiser", url: "https://planimation.planning.domains/problem"}
]

/**
 * Tests the references page.
 * @param page: the page to interact with
 * @returns {Promise<void>}
 */
async function testReferences(page) {
    await clickAndVerify(page, NAV_REF, "References", REF_URL);

    // check each URL in the list of references
    for (let i = 0; i < REFERENCES.length; i++) {
        // handle pop-up pages
        let refLocator = page.locator(`.ref-list > li:nth-child(${i+1}) > span > a`);
        assert.equal(await refLocator.innerText(), REFERENCES[i].text);

        // Start waiting for popup before clicking.
        const popupPromise = page.waitForEvent('popup');
        await refLocator.click();
        const popup = await popupPromise;
        // Wait for the popup to load.
        await popup.waitForLoadState();

        // verify
        assert.equal(popup.url(), REFERENCES[i].url);
    }
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
    await clickAndVerifyLocation(page, `[alt='${chosenDomain}']`, expectedDomainUrl);

    // click "View Source Code" button
    await clickAndVerify(page, DOMAIN_SRC_CODE_BTN, "View source code", DOMAIN_SRC_CODE_URL_PREFIX + chosenDomain);

    // return to gallery
    await page.goto(expectedDomainUrl);
    await testPddlEditorFrame(page);

    // return to gallery
    await clickAndVerify(page, RETURN_BTN, RETURN_BTN_TEXT, GALLERY_URL);
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
    await clickAndVerify(page, EXPLORE_DOMAINS_BTN, "EXPLORE DOMAINS", GALLERY_URL);
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
    await clickAndVerify(page, RETURN_BTN, RETURN_BTN_TEXT, DOC_URL);
}

async function testYoutubeFrame(page) {
    const playBtnLocator = page.frameLocator('.youtube-demo');
    await playBtnLocator.locator('.ytp-large-play-button').click();
}