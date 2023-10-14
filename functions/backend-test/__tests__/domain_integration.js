import { GALLERY_URL, NOT_FOUND_URL, readDomainName, readDomainPDDL, readDomainDesc, getFirestoreEmulator, readDomainsFromDB, TEST_NON_EXIST_NAME} from "./backend-test-util";
const { chromium } = require('playwright');

describe('Domain page', ()=> {
    let browser;
    let db;
    let databaseDomains;

    // set up the browser and webpage
    beforeAll(async() => {
        db = await getFirestoreEmulator();
        databaseDomains = await readDomainsFromDB(db);
        browser = await chromium.launch({ headless: true }); //headless:false to see the window
    });

    it('(4b.1) correctly displays individual domain page', async() => {
        const page1 = await browser.newPage();

        for (const validDomain of databaseDomains) {
            await page1.goto(`${GALLERY_URL}/${validDomain.name}`);
            
            // verify some contents
            // PDDL editor embedding link
            expect(await readDomainPDDL(page1)).toBe(validDomain.sessionLink);
            // domain name
            expect(await readDomainName(page1)).toBe(validDomain.name);
            // description: backticks should be removed
            expect(await readDomainDesc(page1)).toBe(validDomain.description.replace(/`/g, ''));
        }
        await page1.close();
    })

    it('(4b.2) handles non-existing domain page', async() => {
        const page2 = await browser.newPage();
        await page2.goto(`${GALLERY_URL}/${TEST_NON_EXIST_NAME}`);
        try {
            await page2.waitForURL(NOT_FOUND_URL, {timeout:1000});
            expect(true).toBe(true);
        } catch (error){
            expect(false).toBe(true);
        }
        await page2.close();
    })

    afterAll(async () => {
        //await new Promise(resolve => setTimeout(resolve, 30000)); // uncomment to interact with the window for longer
        await browser.close();
    })

})
