import { addData } from "./gallery-block-template.mjs";
import { enableCollapsible } from "./gallery-block-template.mjs";
import { hideHeaderAboveTitle, createAnchor } from "./util.js";
import { fetchDocFromCollection, loadDocumentContent, DB } from "./fetch-data.js";

const GALLERY_DIV = document.querySelector("div.gallery");
const ANIMATION_COLLECTION = "animation";
const THUMBNAIL_PATH = "assets/resources/thumbnails/";
const CHILD_DIR = "/gallery/";

// Fetch the animation documents from Firestore, and creates a gallery 'item' for each.
fetchDocFromCollection(ANIMATION_COLLECTION, createGalleryItem);


/**
 * Returns the path of the thumbnail for the given domain.
 * @param domainName: a string representing the name of a domain
 * @returns {string}: the path to that domain's thumbnail
 */
const getThumbnail = (domainName) => { return THUMBNAIL_PATH + domainName + ".png"};

/**
 * Creates a gallery item for the domain specified by the document.
 * @param domainDoc: the document containing data for the domain
 */
function createGalleryItem(domainDoc) {
    const domainName = domainDoc.data().name;
    let galleryItem = document.createElement('div');

    // create the link
    galleryItem.className = 'gallery-item';
    let link = createAnchor(CHILD_DIR + domainName, '');
    link.dataset.type = 'domain';

    // create the thumbnail
    let thumbnail = document.createElement('img');
    thumbnail.className = "thumbnail";
    thumbnail.src = getThumbnail(domainName);
    thumbnail.alt = domainName;
    thumbnail.dataset.docId = domainDoc.id;

    // create the caption
    let caption = document.createElement('span');
    caption.className = 'caption';
    caption.textContent = domainName;
    caption.dataset.docId = domainDoc.id;

    // add the new elements
    link.appendChild(thumbnail);
    link.appendChild(caption)
    galleryItem.appendChild(link);
    GALLERY_DIV.appendChild(galleryItem);
}



/**
 * Loads the content of a domain's document.
 */
function loadDomainDocContent() {
    loadDocumentContent(ANIMATION_COLLECTION, 'domain', 'name',
        (doc) => {
            loadDomainPage(doc);
            changePageDisplay();
            hideHeaderAboveTitle(GALLERY_DIV);
        }
    );
}

/**
 * Loads the page for an individual domain, retrieving data from the specified document.
 * @param doc: the document containing data for the domain.
 */
function loadDomainPage(doc) {
    // Swap the content div
    GALLERY_DIV.innerHTML =
        `
        <h1 id="domain-name"></h1>
        <div class="domain-desc"><p id="domain-desc"></p></div>
        <div id="animation-guide"></div><h2></h2>
        <div class="animation-container"><iframe id="pddl-editor" width="100%" height="100%"></iframe></div>
        <button class="btn" id="view-src-code"></button>
        <button class="btn return" onclick="window.location.href='/gallery.html'" type='button'>Return</button>
        `;
    document.body.onLoad = addData(doc);
    enableCollapsible();
}

/**
 * Changes the page display for the individual domain page.
 */
function changePageDisplay() {
    GALLERY_DIV.style.display = "block";
    GALLERY_DIV.style.margin = "70px auto";
}

window.onload = function() {
    // Check if the URL path contains "/gallery/"
    if (window.location.pathname.includes(CHILD_DIR)) {
        loadDomainDocContent();
    }
};
