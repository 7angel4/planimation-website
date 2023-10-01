import {DISTRIBUTE_FUNCTION_CATEGORY} from "./test_data_constants";
const INDEX_URL = 'http://localhost:5004/';
const DOC_TABLE_CONTENT = ".doc-table-content";
const DISTRIBUTE_FUNCTIONS_TABLE = "#distribute-functions " + DOC_TABLE_CONTENT;
const OTHER_FUNCTIONS_TABLE = "#other-functions " + DOC_TABLE_CONTENT;
const FUNCTION_TABLE_KEYWORD = "function-table-keyword";
const VISUAL_PROPERTY_ID = "visual-properties";
const VISUAL_PROPERTIES_TABLE = "#" + VISUAL_PROPERTY_ID + " " + DOC_TABLE_CONTENT;
const FUNCTION_NAME = '#function-name';
const YOUTUBE_EMBED = '.youtube-demo';
const PROPERTY_NAME = VISUAL_PROPERTIES_TABLE + ' td:first-child';
const PARAMETER_NAME = '#parameters code'
const DESCRIPTION = '#description'
export const DOCUMENTATION_URL = INDEX_URL + 'documentation'
export const NOT_FOUND_URL = INDEX_URL + '404'

const getTextContent = (element) => element.textContent.trim();
const getArrayTextContent = (elements) => elements.map((element) => element.textContent.trim());


/**
 * Create a new documentation page
 * @param browser: browser to open the page in
 * @returns a new documentation page
 */
export async function newDocumentationPage(browser) {
    // create a new webpage and go to the documentation page
    const page = await browser.newPage();
    try {
        await page.goto(DOCUMENTATION_URL);
    } catch (error) {
        console.error('Access webpage:', error);
    }
    // wait for dynamic contents to be display before any actions are performed
    await waitSectionAppear(page, `${DISTRIBUTE_FUNCTIONS_TABLE} code.${FUNCTION_TABLE_KEYWORD}`);
    return page;
}


/**
     * Read all function names displayed on the webpage in a particular category
     * @param page: the page to interact with
     * @param category: the category to read functions from
     * @returns {string[]}
     */
export async function readFuncInCategory(page, category) {
    let selector = category === DISTRIBUTE_FUNCTION_CATEGORY ? DISTRIBUTE_FUNCTIONS_TABLE : OTHER_FUNCTIONS_TABLE;
    selector = `${selector} code.${FUNCTION_TABLE_KEYWORD}`;
    return await getContent(page, selector, getArrayTextContent, true);
}

/**
 * Read visual properties displayed on the webpage
 * @param page: the page to interact with
 * @returns {string[]}
 */
export async function readVisualProperty(page) {
    return await getContent(page, PROPERTY_NAME, getArrayTextContent, true);
}

/**
 * Read the link of the embedded youtube video displayed on the webpage
 * @param page: the page to interact with
 * @returns {string}
 */
export async function readVideoLink(page) {
    return await getContent(page, YOUTUBE_EMBED, (iframe) => iframe.getAttribute('src'));
}

/**
 * Read the function name displayed on the webpage
 * @param page: the page to interact with
 * @returns {string}
 */
export async function readFunctionName(page) {
    return await getContent(page, FUNCTION_NAME, getTextContent);
}

/**
 * Read the function parameter names displayed on the webpage
 * @param page: the page to interact with
 * @returns {string[]}
 */
export async function readParameterName(page) {
    return await getContent(page, PARAMETER_NAME, getArrayTextContent,true);
}

/**
 * Read the function description displayed on the webpage
 * @param page: the page to interact with
 * @returns {string}
 */
export async function readDescription(page) {
    return await getContent(page, DESCRIPTION, getTextContent);
}

/**
 * Get contents from a webpage
 * @param page: the page to interact with
 * @param selector: selector that reference the section on the webpage
 * @param action: action to be performed on the retrieved content
 * @param isArray: whether an array is to be retrieved
 * @returns 
 */
async function getContent(page, selector, action, isArray=false) {
    try {
        await waitSectionAppear(page, selector);
    } catch (error) { // no table at the specified category
        return isArray? []:undefined;
    }
    
    if (isArray) {
        return await page.$$eval(selector, action);
    }
    return await page.$eval(selector, action);
}

/**
 * Wait for a section to appear on the webpage
 * @param page: the page to interact with
 * @param selector: selector that reference the section on the webpage
 */
export async function waitSectionAppear(page, selector) {
    await page.waitForSelector(selector, {timeout:1000});
}