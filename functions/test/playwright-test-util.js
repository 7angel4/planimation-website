const assert = require('assert');

async function clickAndVerifyLocation(page, btnSelector, expectedLocation) {
    // check redirection
    await page.click(btnSelector);
    assert.equal(page.url(), expectedLocation);
}

async function clickAndVerify(page, btnSelector, expectedText, expectedLocation) {
    // check text display
    let locator = page.locator(btnSelector);
    assert.equal(await locator.innerText(), expectedText);
    // check redirection
    await locator.click();
    assert.equal(page.url(), expectedLocation);
}

const getRandomElem = (list) => {
    return list[Math.floor(Math.random() * list.length)];
}

module.exports.clickAndVerifyWithText = clickAndVerifyWithText;
module.exports.clickAndVerify = clickAndVerify;
module.exports.getRandomElem = getRandomElem;