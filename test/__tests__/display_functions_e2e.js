import { TEST_DATA_VALID } from "./test_data_constants";
const { chromium } = require('playwright');

const TABLE_CONTENT_CLASS = ".doc-table-content";
const DISTRIBUTE_FUNCTIONS_TABLE = "#distribute-functions " + TABLE_CONTENT_CLASS;
const OTHER_FUNCTIONS_TABLE = "#other-functions " + TABLE_CONTENT_CLASS;
const DISTRIBUTE_FUNCTION_CATEGORY = "distribute";

describe('Display function stored in database', ()=> {
    let browser;
    let page;

    // set up the browser and webpage
    beforeAll(async() => {
        browser = await chromium.launch({ headless: true }); //headless:false to see the window
        page = await browser.newPage();
    });


    it('has a documentation list page', async() => {
        try {
            await page.goto('http://localhost:5004/documentation')
            .then(() => {
                expect(true).toBe(true);
            })
        } catch (error) {
            console.error('Access webpage:', error);
            expect(false).toBe(true);
        }
    })

    it('lists stored valid functions in the correct category', async() => {
        for (const validFunctions of TEST_DATA_VALID) {
            // check function category
            const category = validFunctions.category;
            const selector = category === DISTRIBUTE_FUNCTION_CATEGORY ? DISTRIBUTE_FUNCTIONS_TABLE : OTHER_FUNCTIONS_TABLE;
            
            // retrieve all code elements (function anmes) in the specified category
            await page.waitForSelector(`${selector} code.table-keyword`, { timeout: 5000 });
            const codeElements = await page.$$eval(`${selector} code.table-keyword`, (elements) => {
                return elements.map((element) => element.textContent);
            });
            
            // check whether the test data is displayed in the correct category
            expect(codeElements.includes(validFunctions.functionName)).toBe(true);
        }
    })

    afterAll(async () => {
        //await new Promise(resolve => setTimeout(resolve, 30000)); // uncomment to interact with the window for longer
        await browser.close();
    })

})