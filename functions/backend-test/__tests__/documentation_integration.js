import { getFirestoreEmulator, readFunctionsFromDB, readVisualPropertyFromDB, DISTRIBUTE_FUNCTION_CATEGORY, OTHER_FUNCTION_CATEGORY, getAllFunc, getCategoryFunc, TEST_NON_EXIST_NAME } from "./backend-test-util";
import { readFuncInCategory, readVisualProperty, newDocumentationPage, enterSearchBox, clearSearchBox } from "./backend-test-util";
const { chromium } = require('playwright');

describe('Documentation page', ()=> {
    let browser;
    let db;
    let databaseFunctions;
    let databaseVisualProperties;

    // set up the firestore, test data, browser and webpage
    beforeAll(async() => {
        db = await getFirestoreEmulator();
        databaseFunctions = await readFunctionsFromDB(db);
        databaseVisualProperties = await readVisualPropertyFromDB(db);
        browser = await chromium.launch({ headless: true }); //headless:false to see the window
    });


    it('(3b.1) displays valid functions correctly', async() => {
        const page1 = await newDocumentationPage(browser);
        for (const validFunctions of getAllFunc(databaseFunctions, true)) {
            // check function category
            const category = validFunctions.category;
            const displayedFunctions = await readFuncInCategory(page1, category);
            
            // check whether the frontend-test data is displayed in the correct category
            expect(displayedFunctions.includes(validFunctions.functionName)).toBe(true);
        }
        await page1.close()
    })


    it('(3b.3) handles search of valid functions', async() => {
        const page3 = await newDocumentationPage(browser);
        // get testing values
        const distributeValidFunctions = getCategoryFunc(databaseFunctions, DISTRIBUTE_FUNCTION_CATEGORY, true);
        const otherValidFunctions = getCategoryFunc(databaseFunctions, OTHER_FUNCTION_CATEGORY, true);
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
            await enterSearchBox(page3, testValues[i]);
            // check the function is listed
            let displayedFunctions = await readFuncInCategory(page3, testFunctions[i].category);
            expect(displayedFunctions.includes(testFunctions[i].functionName)).toBe(true);
            // clear anything in the search bar
            await clearSearchBox(page3);
        }
        await page3.close();
    })

    it('(3b.4) handles search non-existing functions', async() => {
        const page4 = await newDocumentationPage(browser);
        // type in test value
        await enterSearchBox(page4, TEST_NON_EXIST_NAME);
        // ensure both categories have no functions displayed
        for (const category of [DISTRIBUTE_FUNCTION_CATEGORY, OTHER_FUNCTION_CATEGORY]) {
            let displayedFunctions = await readFuncInCategory(page4, category);
            expect(displayedFunctions.length).toEqual(0);
        }
        // clear anything in the search bar
        await clearSearchBox;
        await page4.close();
    })

    it('(3b.5) view visual properties', async() => {
        const page5 = await newDocumentationPage(browser);
        for (const visualProperty of databaseVisualProperties) {
            // check function category
            const displayedProperties = await readVisualProperty(page5);
            // check whether the frontend-test data is displayed in the correct category
            expect(displayedProperties.includes(visualProperty.desc.name)).toBe(true);
        }
        await page5.close();
    })

    afterAll(async () => {
        //await new Promise(resolve => setTimeout(resolve, 30000)); // uncomment to interact with the window for longer
        await browser.close();
    })

})

