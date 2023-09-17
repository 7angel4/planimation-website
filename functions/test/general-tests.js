const {Builder, By} = require("selenium-webdriver");
const assert = require('assert');

const INDEX_URL = "https://planimation-staging-181bc.web.app/";
// launch the browser

async function checkTitle(page, expectedTitle) {
    const driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get(page);
        assert.equal(driver.getTitle(), expectedTitle);
    } catch (e) {
        alert(e);
    }
}

async function testClick(from, to, toClick, textDisplay) {
    const driver = await new Builder().forBrowser("chrome").build();

    // navigate to our website
    await driver.get(from);

    let link = await driver.findElement(By.css(toClick));
    assert.strictEqual(link.getText(), textDisplay);

    // verify destination is correct
    link.click();
    console.log(window.location.href)
    assert.strictEqual(window.location.href, to);

    // close the browser
    await driver.quit();
}

module.exports.testClick = testClick;

// testClick(INDEX_URL, INDEX_URL+"documentation", ".to-home", "Home");
checkTitle(INDEX_URL, "Planiwiki");