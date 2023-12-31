import { readVideoLink, readFunctionName, readParameterName, readFuncDescription, waitSectionAppear, DOCUMENTATION_URL, NOT_FOUND_URL, readFunctionsFromDB, getFirestoreEmulator, getAllFunc, TEST_NON_EXIST_NAME } from "./backend-test-util";
const { chromium } = require('playwright');
const NOT_FUNCTIONING = '.non-functioning-warning';


describe('Function page', ()=> {
    let browser;
    let db;
    let databaseFunctions;

    // set up the browser and webpage
    beforeAll(async() => {
        db = await getFirestoreEmulator();
        databaseFunctions = await readFunctionsFromDB(db);
        browser = await chromium.launch({ headless: true }); //headless:false to see the window
    });

    it('(5b.1) correctly displays individual function page', async() => {
        const page1 = await browser.newPage();

        for (const validFunction of getAllFunc(databaseFunctions, false)) {
            await page1.goto(`${DOCUMENTATION_URL}/${validFunction.desc.functionName}`);
            
            // verify some contents
            // has not functioning warning if the function is not functioning
            if (validFunction.desc.notFunctioning) {
                try {
                    await waitSectionAppear(page1, NOT_FUNCTIONING);
                    expect(true).toBe(true);
                } catch {
                    expect(false).toBe(true);
                }
                continue;
            }
            if (!validFunction.desc.notFunctioning) {
                // youtube embedding link
                expect(await readVideoLink(page1)).toBe(validFunction.desc.youtubeEmbeddingLink);
                // parameters
                const parameters = await readParameterName(page1);
                expect(parameters.length).toBe(validFunction.parameter.length);
                for (const param of validFunction.parameter) {
                    expect(parameters.includes(param.parameterName)).toBe(true);
                }
            }
            // function name
            expect(await readFunctionName(page1)).toBe(validFunction.desc.functionName); 
            // description: backticks should be removed
            expect(await readFuncDescription(page1)).toBe(validFunction.desc.briefDescription.replace(/`/g, ''));
        }
        await page1.close();
    })

    it('(5b.2) handles non-existing function page', async() => {
        const page2 = await browser.newPage();
        await page2.goto(`${DOCUMENTATION_URL}/${TEST_NON_EXIST_NAME}`);
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
