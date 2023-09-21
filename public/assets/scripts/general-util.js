/**
 * Gets the HTML code to embed the specified YouTube video.
 * @param link: URL of the video demo on YouTube
 * @returns the HTML code required to embed the given YouTube video
 */
export const getYouTubeEmbedding = (link) => {
    return `
        <iframe class="youtube-demo" width="560" height="315" src=${link} 
            title="YouTube video player" frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
    `;
};

/**
 * Wraps the text in a code element.
 * @param text: string representing the text to be wrapped
 * @returns {HTMLElement}: the HTML `code` element holding the text
 */
export const wrapTextInCode = (text) => {
    const code = document.createElement('code');
    code.textContent = text;
    return code;
}

/**
 * Wraps the text in a paragraph element.
 * @param text: string representing the text to be wrapped
 * @returns {HTMLElement}: the HTML `p` element holding the text
 */
export const wrapTextInParagraph = (text) => {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
}

/**
 * Creates a list item holding the text.
 * @param text: string representing the text to be wrapped
 * @returns {HTMLLIElement}: the HTML `li` element holding the text
 */
export const createLiWithText = (text) => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
}

/**
 * Creates a list item element holding the provided text wrapped in code.
 * @param code: string representing the code content
 * @param text: string representing the plain text content
 * @returns {HTMLLIElement}: a HTML `li` element holding the text in code.
 */
export const createLiWithCodeAndText = (code, text) => {
    let li = createLiWithText(text);
    li.appendChild(wrapTextInCode(code));
    return li;
}

/**
 * Wraps the provided text in a paragraph element,
 * and creates a table data entry holding that paragraph element.
 * @param text: string representing the text to be wrapped
 * @returns {HTMLTableCellElement}: the HTML `li` element holding the text
 */
export const createTdWithP = (text) => {
    const textContainer = document.createElement('p');
    textContainer.textContent = text;
    return createTdWithElem(textContainer);
}

/**
 * Creates a table data entry that holds the given element.
 * @param elem: the element to be held in the cell
 * @returns {HTMLTableCellElement}: the resulting HTML `td` element.
 */
export const createTdWithElem = (elem) => {
    const td = document.createElement('td');
    td.appendChild(elem);
    return td;
}

/**
 * Creates a table data entry that holds the text in code format.
 * @param text: string representing content of the cell
 * @returns {HTMLTableCellElement}: the resulting HTML `td` element.
 */
export const createTdWithCode = (text) => {
    const code = wrapTextInCode(text);
    const td = createTdWithP("");
    td.children[0].appendChild(code);
    return td;
}

/**
 * Formats the string  (handles newline characters exported from Firebase)
 * @param s: string to be formatted
 * @returns {string}: the formatted string.
 */
export const formatString = (s) => { return s.replaceAll("\\n", "\r\n"); }

/**
 * Hides the head banner and search bar, and corrects the title display accordingly.
 * @param elemToFix: the element following the removed elements whose margin is to be adjusted
 */
export function hideHeaderAboveTitle(elemToFix) {
    const headBanner = document.querySelector('head-banner');
    headBanner.hidden = true;
    const searchBar = document.querySelector('search-bar');
    searchBar.hidden = true;
    // correct the title display
    elemToFix.style['margin-top'] = '8rem';
}

/**
 * Converts all paragraph elements in the document to markdown format
 * (i.e. detects code snippets).
 */
export function convertToMarkdown() {
    // convert all paragraph elements
    const pElems = document.querySelectorAll('p');
    pElems.forEach((p) => {
        p.innerHTML = p.innerHTML.replace(/`(.*?)`/g, '<code>$1</code>');
    });
}

/**
 * Creates a button with the given class name and text display.
 * @param className: class name to add to the button
 * @param text: text to be displayed by the button
 * @returns {HTMLButtonElement}: the created button.
 */
export function createButton(className, text) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add(className);
    btn.innerHTML = text;
    return btn;
}

/**
 * Creates a link with the given hyperlink reference and text display.
 * @param ref: string representing the location url
 * @param text: text to be displayed by the anchor element
 * @returns {HTMLAnchorElement}: the created anchor element.
 */
export function createAnchor(ref, text) {
    const anchor = document.createElement('a');
    anchor.href = ref;
    anchor.text = text;
    return anchor;
}

/**
 * Creates an image with the given source, alt text, and class name.
 * @param src: string representing the image's source
 * @param alt: string representing the alternative info (alt text) for the image
 * @param className: string representing the class name of the element
 * @returns {HTMLImageElement}: the created image element
 */
export function createImage(src, alt, className) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add(className);
    return img;
}

/**
 * Capitalise the first letter of the given string.
 * @param text: string to be formatted
 * @returns {string}: the formatted string
 */
export const capitaliseFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}