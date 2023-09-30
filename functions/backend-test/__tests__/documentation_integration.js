import { TEST_FUNCTIONS_VALID, DISTRIBUTE_FUNCTION_CATEGORY, OTHER_FUNCTION_CATEGORY, getAllFunc, getCategoryFunc, TEST_VISUAL_PROPERTY} from "./test_data_constants";
import { readFuncInCategory, readVisualProperty } from "./backend-test-util";
import { beforeEach } from "node:test";
const { chromium } = require('playwright');


const SEARCH_INPUT = '#search-input';

describe('Display function stored in database', ()=> {
    let browser;
    let page;

    // set up the browser and webpage
    beforeAll(async() => {
        browser = await chromium.launch({ headless: true }); //headless:false to see the window
        page = await browser.newPage();
        try {
            await page.goto('http://localhost:5004/documentation');
        } catch (error) {
            console.error('Access webpage:', error);
        }
        await page.evaluate(() => {
            const searchInput = document.querySelector(SEARCH_INPUT); // Replace with your selector
            searchInput.addEventListener('input', (event) => {
              console.log('Input event:', event.target.value);
            });
        });
    });


    it('(3b.1) lists stored valid functions under the correct section', async() => {
        for (const validFunctions of getAllFunc(TEST_FUNCTIONS_VALID, true)) {
            // check function category
            const category = validFunctions.category;
            const displayedFunctions = await readFuncInCategory(page, category);
            
            // check whether the frontend-test data is displayed in the correct category
            expect(displayedFunctions.includes(validFunctions.functionName)).toBe(true);
        }
    })


    it('(3b.3) can search valid functions', async() => {
        // get testing values
        const distributeValidFunctions = getCategoryFunc(TEST_FUNCTIONS_VALID, DISTRIBUTE_FUNCTION_CATEGORY, true);
        const otherValidFunctions = getCategoryFunc(TEST_FUNCTIONS_VALID, OTHER_FUNCTION_CATEGORY, true);
        let testFunctions = [distributeValidFunctions[0], undefined, distributeValidFunctions[0]];
        // discard the first and last letter, to test whether partial name can be searched
        let testPartialName;
        for (const func of otherValidFunctions) {
            testPartialName = func.functionName;
            if (testPartialName.length >= 3) {
                testPartialName = testPartialName.slice(-(testPartialName.length-1));
                testPartialName = testPartialName.slice(0,testPartialName.length-1);
                testFunctions[1] = func;
                break;
            }
        }
        // 3 tests: full name, partial name, capitalised
        const testValues = [testFunctions[0].functionName, 
                            testPartialName, 
                            testFunctions[0].functionName.toUpperCase()];


        // test whether functions containing the test value are shown on the webpage upon inputting the test values
        for (let i = 0; i < testValues.length; i=i+1) {
            if (testValues[i] === undefined) {
                continue;
            }
            // type in test value
            await page.type(SEARCH_INPUT, testValues[i]);
            // check the function is listed
            let displayedFunctions = await readFuncInCategory(page, testFunctions[i].category);
            expect(displayedFunctions.includes(testFunctions[i].functionName)).toBe(true);
            // clear anything in the search bar
            await page.fill(SEARCH_INPUT, '');
        }
    })

    it('(3b.4) display no functions when searching non-existing functions', async() => {
        const TEST_DATA = 'asdfghjkl';
        // type in test value
        await page.type(SEARCH_INPUT, TEST_DATA);
        // ensure both categories have no functions displayed
        for (const category of [DISTRIBUTE_FUNCTION_CATEGORY, OTHER_FUNCTION_CATEGORY]) {
            let displayedFunctions = await readFuncInCategory(page, category);
            expect(displayedFunctions.length).toEqual(0);
        }
        // clear anything in the search bar
        await page.fill(SEARCH_INPUT, '');
        
    })

    it('(3b.5) view visual properties', async() => {
        for (const visualProperty of TEST_VISUAL_PROPERTY) {
            // check function category
            const displayedProperties = await readVisualProperty(page);
            // check whether the frontend-test data is displayed in the correct category
            expect(displayedProperties.includes(visualProperty.desc.name)).toBe(true);
        }
    })

    afterAll(async () => {
        //await new Promise(resolve => setTimeout(resolve, 30000)); // uncomment to interact with the window for longer
        await browser.close();
    })

})

