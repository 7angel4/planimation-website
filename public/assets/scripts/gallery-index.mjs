const GALLERY_DIV = document.querySelector("div.gallery");
const THUMBNAIL_PATH = "assets/resources/thumbnails/"

const getThumbnail = (domainName) => { return THUMBNAIL_PATH + domainName + ".png"};
const getWebpage = (domainName) => { return domainName + ".html" };
function createGalleryItem(domain) {
    let galleryItem = document.createElement('div');
    galleryItem.className = "gallery-item";
    let link = document.createElement('a');
    link.href = getWebpage(domain);

    let thumbnail = document.createElement('img');
    thumbnail.className = "thumbnail";
    thumbnail.src = getThumbnail(domain);
    thumbnail.alt = domain;

    let caption = document.createElement('span');
    caption.className = "caption";
    caption.textContent = domain;

    link.appendChild(thumbnail);
    link.appendChild(caption)
    galleryItem.appendChild(link);
    GALLERY_DIV.appendChild(galleryItem);
}

const DOMAINS = [
    "Elevators", "Freecell", "Gripper",
    "Depot", "BlocksWorld", "Logistics",
    "15puzzle", "Grid", "Family-and-fisherman",
    "Farmer-crosses-River", "FlowFree", "Towers-of-Hanoi",
    "Visitall", "Switching-soldier"
];

// Add all gallery items
DOMAINS.forEach(domain => { createGalleryItem(domain); })