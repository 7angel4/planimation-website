import { readDomain, newGalleryPage, enterSearchBox, clearSearchBox, readDomainsFromDB, TEST_NON_EXIST_NAME, getFirestoreEmulator} from "./backend-test-util";
const { chromium } = require('playwright');


describe('Gallery page', ()=> {
    let browser;
    let db;
    let databaseDomains;

    // set up the browser and webpage
    beforeAll(async() => {
        db = await getFirestoreEmulator();
        databaseDomains = await readDomainsFromDB(db);
        browser = await chromium.launch({ headless: true }); //headless:false to see the window
    });

    it('(2b.1) displays valid domains', async() => {
        const page1 = await newGalleryPage(browser);
        const displayedDomains = await readDomain(page1);
        for (const domain of databaseDomains) {
            // check whether the frontend-test data is displayed in the correct category
            expect(displayedDomains.includes(domain.name)).toBe(true);
        }
        await page1.close()
    })

    it('(2b.2) handles search of valid domains', async() => {
        const page2 = await newGalleryPage(browser);
        // get testing values
        let testDomains = [databaseDomains[0], undefined, databaseDomains[0], databaseDomains[0]];
        // discard the first and last letter, to test whether partial name can be searched
        let testPartialName;
        for (const domain of databaseDomains) {
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
            await enterSearchBox(page2, testValues[i]);
            // check the function is listed
            let displayedDomains = await readDomain(page2);
            expect(displayedDomains.includes(testDomains[i].name)).toBe(true);
            // clear anything in the search bar
            await clearSearchBox(page2);
        }
        await page2.close();
    })

    it('(2b.3) handles search non-existing domain', async() => {
        const page3 = await newGalleryPage(browser);
        // type in test value
        await enterSearchBox(page3, TEST_NON_EXIST_NAME);
        // ensure no domain is displayed
        const displayedDomains = await readDomain(page3);
        expect(displayedDomains.length).toEqual(0);
        // clear anything in the search bar
        await clearSearchBox;
        await page3.close();
    })

    afterAll(async () => {
        //await new Promise(resolve => setTimeout(resolve, 30000)); // uncomment to interact with the window for longer
        await browser.close();
    })

})