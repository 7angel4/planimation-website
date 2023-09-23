const assert = require('assert');

async function clickAndVerifyLocation(page, btnSelector, expectedLocation) {
    // check redirection
    await page.click(btnSelector);
    assert.equal(page.url(), expectedLocation);
}

/**
 * Clicks the selected button/anchor, and verifies if its displayed text and location url are as expected.
 * @param page: the page to interact with
 * @param btnSelector: the selector for the button to be clicked
 * @param expectedText: expected text displayed by the button
 * @param expectedLocation: expected location of the button
 * @returns {Promise<void>}
 */
async function clickAndVerify(page, btnSelector, expectedText, expectedLocation) {
    // check text display
    let locator = page.locator(btnSelector);
    console.log(await locator.innerText());
    assert.equal(await locator.innerText(), expectedText);
    // check redirection
    await locator.click();
    assert.equal(page.url(), expectedLocation);
}

const getRandomElem = (list) => {
    return list[Math.floor(Math.random() * list.length)];
}

module.exports.clickAndVerifyLocation = clickAndVerifyLocation;
module.exports.clickAndVerify = clickAndVerify;
module.exports.getRandomElem = getRandomElem;