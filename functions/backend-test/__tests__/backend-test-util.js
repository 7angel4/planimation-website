import {DISTRIBUTE_FUNCTION_CATEGORY} from "./test_data_constants";
const DOC_TABLE_CONTENT = ".doc-table-content";
const DISTRIBUTE_FUNCTIONS_TABLE = "#distribute-functions " + DOC_TABLE_CONTENT;
const OTHER_FUNCTIONS_TABLE = "#other-functions " + DOC_TABLE_CONTENT;
const FUNCTION_TABLE_KEYWORD = "function-table-keyword";
const VISUAL_PROPERTY_ID = "visual-properties";
const VISUAL_PROPERTIES_TABLE = "#" + VISUAL_PROPERTY_ID + " " + DOC_TABLE_CONTENT;

/**
     * Read all function names displayed on the webpage in a particular category
     * @param page: the page to interact with
     * @param category: the category to read functions from
     * @returns {string[]}
     */
export async function readFuncInCategory(page, category) {
    const selector = category === DISTRIBUTE_FUNCTION_CATEGORY ? DISTRIBUTE_FUNCTIONS_TABLE : OTHER_FUNCTIONS_TABLE;
    try {
        await page.waitForSelector(`${selector} code.${FUNCTION_TABLE_KEYWORD}`, { timeout: 1000 });
    } catch (error) { // no table at the specified category
        return [];
    }
    
    const displayedFunctions = await page.$$eval(`${selector} code.${FUNCTION_TABLE_KEYWORD}`, (elements) => {
        return elements.map((element) => element.textContent);
    });
    return displayedFunctions;
}

/**
 * Read visual properties displayed on the webpage
 * @param page: the page to interact with
 * @returns {string[]}
 */
export async function readVisualProperty(page) {
    const selector = VISUAL_PROPERTIES_TABLE;
    try {
        await page.waitForSelector(`${selector} td:first-child`, { timeout: 5000 });
    } catch (error) { // no table at the specified category
        return [];
    }
    
    const displayedProperties = await page.$$eval(`${selector} td:first-child`, (elements) => {
        return elements.map((element) => element.textContent.trim());
    });
    return displayedProperties;
}