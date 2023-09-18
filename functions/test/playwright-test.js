"use strict";

const { chromium } = require('playwright');
const assert = require('assert');

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
const GALLERY_SRC_CODE_BTN = ".view-ap-src-code";
const AP_SRC_CODE_URL = "https://github.com/planimation/documentation/tree/master/AnimationProfiles";
const DOMAIN_SRC_CODE_BTN = "#view-source-code";
const DOMAIN_SRC_CODE_URL_PREFIX = "https://github.com/planimation/documentation/tree/af1851dd6c679f554afa7bab88f7d37d56187c1b/AnimationProfiles/";
const LOGO_IMG = ".logo-img";

(async () => {
    const browser = await chromium.launch({headless: false});
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
    await page.click(SUGGESTIONS_URL);
    await page.click("[target='_blank']");
    await page.setViewportSize({width: 1440, height: 731});
    await page.click(LOGO_IMG);
    // return to home page
    await page.click(LOGO_IMG);
    assert.equal(page.url(), INDEX_URL);
}

async function testReferences(page) {
    await page.click(NAV_REF);
    assert.equal(page.url(), REF_URL);

    // check the list of URLs
    await page.click(".ref-list > :nth-child(1) [target='_blank']");
    assert.equal(page.url(), REF_URL);
    await page.click(".ref-list > :nth-child(2) [target='_blank']");
    await page.click(".ref-list > :nth-child(3) [target='_blank']");
    await page.click(".ref-list > :nth-child(4) [target='_blank']");
}

const DOMAINS = ["Family-and-fisherman", "Visitall", "Grid"];
async function testGallery(page) {
    await page.click(NAV_GALLERY);
    // click on "View source code of animation profiles" button in head banner
    await page.click(GALLERY_SRC_CODE_BTN);
    assert.equal(page.url(), AP_SRC_CODE_URL);

    // return to gallery
    await page.goto(GALLERY_URL);
    let chosenDomain = getRandomElem(DOMAINS);
    let expectedDomainUrl = GALLERY_URL + "/" + chosenDomain;

    await page.click(`[alt='${chosenDomain}']`);
    assert.equal(page.url(), expectedDomainUrl);
    // click "View Source Code" button
    await page.click(DOMAIN_SRC_CODE_BTN);
    assert.equal(page.url(), DOMAIN_SRC_CODE_URL_PREFIX + chosenDomain);

    // return to gallery
    await page.goto(expectedDomainUrl);
    await testPddlEditorFrame(page);

}

async function testPddlEditorFrame(page) {
    const pddlEditorLocator = page.frameLocator('#pddl-editor');
    await pddlEditorLocator.locator("#planimationMenuItem > a").click();
    await pddlEditorLocator.locator("#filesChosenButton").click();
    // await pddlEditorLocator.locator("[d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z']").click();
    // await pddlEditorLocator.locator("[d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z']").click();
    // await pddlEditorLocator.locator("._3MfPgPVvFEx5krwdLXMAdU div > :nth-child(1) .MuiSvgIcon-root").click();
    // await pddlEditorLocator.locator(".MuiSlider-root").click();
    // await pddlEditorLocator.locator("[d='M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z']").click();
}

const FUNCTION_DOC_IDS = ["2JelRRGyOoOGXls6fXXB", "6zeSOZbqnlMpo9wKLzLk", "FjBOvZOOv777pzPtDT9y"];


/**
 * Tests the index page -- should start and end at the index page.
 * @param page
 * @returns {Promise<void>}
 */
async function testIndex(page) {
    await page.goto(INDEX_URL);
    // click on "Explore Domains" button
    await page.click(EXPLORE_DOMAINS_BTN);
    assert.equal(page.url(), GALLERY_URL);
    // return to home page
    await page.click(NAV_HOME);
    assert.equal(page.url(), INDEX_URL);
}

async function testDoc(page) {
    await page.click(NAV_DOC);
    await page.goto(DOC_URL);
    // click "View original GitHub documentation" button in head-banner
    await page.click(".view-github-doc");
    // return to documentation page
    await page.goto(DOC_URL);
    // click into a random function's documentation page
    await page.click(`[data-doc-id='${getRandomElem(FUNCTION_DOC_IDS)}']`);
    // play video
    await testYoutubeFrame(page);

    // click "Return" button - should return to documentation page
    await page.click(RETURN_BTN);
    assert.equal(page.url(), DOC_URL);
}

const getRandomElem = (list) => {
    return list[Math.floor(Math.random() * list.length)];
}

async function testYoutubeFrame(page) {
    const playBtnLocator = page.frameLocator('.youtube-demo');
    await playBtnLocator.locator('.ytp-large-play-button').click();
}