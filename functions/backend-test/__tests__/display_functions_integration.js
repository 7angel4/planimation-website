import { TEST_FUNCTIONS_VALID } from "./test_data_constants";
const { chromium } = require('playwright');

const DOC_TABLE_CONTENT = ".doc-table-content";
const DISTRIBUTE_FUNCTIONS_TABLE = "#distribute-functions " + DOC_TABLE_CONTENT;
const OTHER_FUNCTIONS_TABLE = "#other-functions " + DOC_TABLE_CONTENT;
const DISTRIBUTE_FUNCTION_CATEGORY = "distribute";
const FUNCTION_TABLE_KEYWORD = "function-table-keyword";

describe('Display function stored in database', ()=> {
    let browser;
    let page;
    let displayedFunctions;

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

    it('(4b.1) lists stored valid functions in the correct category', async() => {
        for (const validFunctions of TEST_FUNCTIONS_VALID) {
            // check function category
            const category = validFunctions[0].category;
            const selector = category === DISTRIBUTE_FUNCTION_CATEGORY ? DISTRIBUTE_FUNCTIONS_TABLE : OTHER_FUNCTIONS_TABLE;
            
            // retrieve all code elements (function anmes) in the specified category
            await page.waitForSelector(`${selector} code.${FUNCTION_TABLE_KEYWORD}`, { timeout: 5000 });
            displayedFunctions = await page.$$eval(`${selector} code.${FUNCTION_TABLE_KEYWORD}`, (elements) => {
                return elements.map((element) => element.textContent);
            });
            
            // check whether the frontend-test data is displayed in the correct category
            expect(displayedFunctions.includes(validFunctions[0].functionName)).toBe(true);
        }
    })

    afterAll(async () => {
        //await new Promise(resolve => setTimeout(resolve, 30000)); // uncomment to interact with the window for longer
        await browser.close();
    })

})