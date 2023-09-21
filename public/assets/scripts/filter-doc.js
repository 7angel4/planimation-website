const NO_MATCH_MSG = '.no-match-message';
const SEARCH_INPUT = '#search-input';
const SEARCH_CONTEXT_ATTRIBUTE = 'data-context';
const GALLERY_CONTEXT = 'gallery';
const DOC_CONTEXT = 'documentation';
const GALLERY_ITEM = '.gallery-item';
const GALLERY_ITEM_CAPTION = '.caption';
const DOC_TABLE_KEYWORD = '.table-keyword';
const DOC_TABLE_CONTENT = ".doc-table-content";

/**
 * Filters items based on user input.
 * @param userInput: a string representing the user input
 */
function filterItems(userInput) {
    const query = userInput.target.value.toLowerCase();
    const context = this.getAttribute(SEARCH_CONTEXT_ATTRIBUTE);

    switch (context) {
        case DOC_CONTEXT:
            filterFunctionDocs(query);
            break;
        case GALLERY_CONTEXT:
            filterGalleryItems(query);
            break;
        default:
            console.error("Unknown context for filtering items.");
    }
}

/**
 * General function which filters items according to the query.
 * @param items: items to be filtered from
 * @param query: string representing the user query
 * @param extractTextCallback: a callback function to extract text
 * @returns {boolean}: true if any item matches the query, false otherwise
 */
function filterItemsByQuery(items, query, extractTextCallback) {
    let anyVisible = false;

    items.forEach(item => {
        // case insensitive query
        const textContent = extractTextCallback(item).toLowerCase();
        const isVisible = textContent.includes(query);
        // only display the item if it matches the query
        item.style.display = isVisible ? '' : 'none';
        anyVisible = anyVisible || isVisible;
    });

    return anyVisible;
}

/**
 * Displays or hides the match message, depending on whether any results are left after filtering.
 * @param parentElement: the parent element of the match message
 * @param anyVisible: boolean value indicating whether any results are left after filtering
 */
function toggleNoMatchMessage(parentElement, anyVisible) {
    const messageElement = parentElement.querySelector(NO_MATCH_MSG);
    // if no results left after filtering (anyVisible == false), then show the message (hidden = false)
    if (messageElement) messageElement.hidden = anyVisible;
}

/**
 * Filters documents for functions based on the query.
 * @param query: string representing the user's query.
 */
function filterFunctionDocs(query) {
    let tables = document.querySelectorAll(DOC_TABLE_CONTENT);

    tables.forEach(table => {
        let functionRows = table.querySelectorAll('tr');
        let anyVisible = filterItemsByQuery(functionRows, query, row => {
                let tableKeyword = row.querySelector(DOC_TABLE_KEYWORD);
                // prevents the case where `tableKeyword` is null
                return tableKeyword ? tableKeyword.textContent : '';
            }
        );
        // Determine the associated no-match-message for this table.
        let section = table.closest('section');
        toggleNoMatchMessage(section, anyVisible);
    });
}

/**
 * Filters the gallery of domains based on the query.
 * @param query: string representing the user's query.
 */
function filterGalleryItems(query) {
    let galleryItems = document.querySelectorAll(GALLERY_ITEM);
    let anyVisible = filterItemsByQuery(galleryItems, query, item => {
        let caption = item.querySelector(GALLERY_ITEM_CAPTION);
        return caption ? caption.textContent : '';
    });

    // If none are visible, show the message
    this.toggleNoMatchMessage(document, anyVisible);
}


/**
 * Custom HTML Element representing a search bar, which can filter items according to the query.
 */
class SearchBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <div class="search-bar">
                <img class='search-icon' alt='search-icon' src="${ASSETS_PATH}resources/icons/magnifying-glass.png" width="30px" height="30px">
                <input type="text" id="search-input">
            </div>
            <style>
                #search-input {
                    width: 40vw;
                    text-align: center;
                    background-color: #D9D9D9;
                    border-width: 1.5px;
                    border-radius: 25px;
                }
                .search-bar {
                    display: flex;
                    justify-content: center;
                }
                .search-btn {
                    background: transparent;
                    border: none;
                }
            </style>
            `
        const input = this.querySelector(SEARCH_INPUT);

        // Determine the context and set it as a data attribute
        if (window.location.pathname.includes(GALLERY_CONTEXT)) {
            this.setAttribute(SEARCH_CONTEXT_ATTRIBUTE, GALLERY_CONTEXT);
        } else {
            this.setAttribute(SEARCH_CONTEXT_ATTRIBUTE, DOC_CONTEXT);
        }
        input.addEventListener('keyup', filterItems.bind(this));
    }

    /**
     * Sets the text content of the search bar input
     * @param text: string to be displayed on the search bar
     */
    setTextContent(text) {
        const input = document.querySelector(".search-bar > input");
        input.placeholder = text;
    }
}

customElements.define('search-bar', SearchBar);