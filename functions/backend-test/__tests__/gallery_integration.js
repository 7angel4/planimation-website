import { TEST_DOMAIN_VALID, TEST_NON_EXIST_NAME } from "./test_data_constants";
import { GALLERY_URL, NOT_FOUND_URL, readDomainName, newGalleryPage, enterSearchBox, clearSearchBox} from "./backend-test-util";
const { chromium } = require('playwright');


describe('Gallery page', ()=> {
    let browser;

    // set up the browser and webpage
    beforeAll(async() => {
        browser = await chromium.launch({ headless: true }); //headless:false to see the window
    });

    it('(2b.1) displays valid domains', async() => {
        const page1 = await newGalleryPage(browser);
        const displayedDomains = await readDomainName(page1);
        for (const domain of TEST_DOMAIN_VALID) {
            // check whether the frontend-test data is displayed in the correct category
            expect(displayedDomains.includes(domain.name)).toBe(true);
        }
        await page1.close()
    })

    it('(2b.3) handles search of valid domains', async() => {
        const page3 = await newGalleryPage(browser);
        // get testing values
        let testDomains = [TEST_DOMAIN_VALID[0], undefined, TEST_DOMAIN_VALID[0], TEST_DOMAIN_VALID[0]];
        // discard the first and last letter, to test whether partial name can be searched
        let testPartialName;
        for (const domain of TEST_DOMAIN_VALID) {
            testPartialName = domain.name;
            if (testPartialName.length >= 3) {
                testPartialName = testPartialName.slice(-(testPartialName.length-1));
                testPartialName = testPartialName.slice(0,testPartialName.length-1);
                testDomains[1] = domain;
                break;
            }
        }
        // 4 tests: full name, partial name, capitalised, lower case
        const testValues = [testDomains[0].name, 
                            testPartialName, 
                            testDomains[0].name.toUpperCase(), 
                            testDomains[0].name.toLowerCase()];


        // test whether functions containing the test value are shown on the webpage upon inputting the test values
        for (let i = 0; i < testValues.length; i=i+1) {
            if (testValues[i] === undefined) {
                continue;
            }
            // type in test value
            await enterSearchBox(page3, testValues[i]);
            // check the function is listed
            let displayedDomains = await readDomainName(page3);
            expect(displayedDomains.includes(testDomains[i].name)).toBe(true);
            // clear anything in the search bar
            await clearSearchBox(page3);
        }
        await page3.close();
    })

    it('(2b.4) handles search non-existing domain', async() => {
        const page4 = await newGalleryPage(browser);
        // type in test value
        await enterSearchBox(page4, TEST_NON_EXIST_NAME);
        // ensure no domain is displayed
        const displayedDomains = await readDomainName(page4);
        expect(displayedDomains.length).toEqual(0);
        // clear anything in the search bar
        await clearSearchBox;
        await page4.close();
    })

    afterAll(async () => {
        //await new Promise(resolve => setTimeout(resolve, 30000)); // uncomment to interact with the window for longer
        await browser.close();
    })

})