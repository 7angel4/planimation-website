const {Builder, By} = require("selenium-webdriver");
const assert = require("assert");
const should = require("chai").should();

const INDEX_URL = "https://planimation-staging-181bc.web.app/";
const NAV_BAR_TEXTS = ["Home", "Documentation", "Gallery", "References", "Suggestions"];
const NAV_BAR_LINKS = [INDEX_URL, INDEX_URL+"/documentation", INDEX_URL+"/gallery", INDEX_URL+"/references", INDEX_URL+"/suggestions"];
const NAV_BAR_CLASSES = [".to-home", ".to-documentation", ".to-gallery", ".to-references", ".to-suggestions"];

// describe("click link tests", () => {
//     it("successfully clicks the nav-bar links", async function(done) {
//         NAV_BAR_LINKS.forEach((link, i) => {
//             testClick(INDEX_URL, "link", NAV_BAR_CLASSES[i], NAV_BAR_TEXTS[i]);
//         });
//         done();
//     });
// });

describe("click link tests", () => {
    it("successfully clicks the nav-bar links", async function() {
        let driver = await new Builder().forBrowser("chrome").build();

        // navigate to our website
        await driver.get(INDEX_URL);
        let element = driver.wait(function () {
            return driver.isElementPresent(webdriver.By.css(".to-home"));
        }, 10000);
        element.then(()=>{ click(); });
        await driver.quit();
    }).timeout(10000);
});

describe("check page title", () => {
    it("page title is correct", async function() {
        let driver = await new Builder().forBrowser("chrome").build();

        // navigate to our website
        await driver.get(INDEX_URL);
        assert.equal(driver.getTitle(), "Planiwiki");
        await driver.quit();
    }).timeout(10000);
});