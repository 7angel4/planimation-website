const {Builder, By} = require("selenium-webdriver");
// const until = webdriver.until;
const assert = require("assert");
const should = require("chai").should();

const INDEX_URL = "https://planimation-staging-181bc.web.app/";

async function test() {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get(INDEX_URL);
    await driver.manage().setTimeouts({ implicit: 3000 });

    let elem = await driver.findElement(By.css('h1'));
    console.log(driver.getTitle());
    // await driver.findElement(By.css('.to-documentation')).click();
    // await driver.findElement(By.css('.to-gallery')).click();
    // await driver.findElement(By.css('.to-references')).click();
    // await driver.findElement(By.css('.to-suggestions')).click();
    // await driver.findElement(By.css('.to-home')).click();


    await driver.getTitle().then((title) => {
        if (title === "PlaniWiki") {
            console.log("Test passed");
        } else {
            console.log(`Title = ${title}; Test failed`);
        }
    });

    await driver.quit();
}

test();
