/**
 * Gets the HTML code to embed the specified YouTube video.
 * @param link: URL of the video demo on YouTube
 * @returns the HTML code required to embed the given YouTube video
 */
export const getYouTubeEmbedding = (link) => {
    return `<iframe width="560" height="315" src=${link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
};

export const wrapTextInCode = (text) => {
    const code = document.createElement('code');
    code.textContent = text;
    return code;
}

export const createTdWithP = (text) => {
    const textContainer = document.createElement('p');
    textContainer.textContent = text;
    return createTdWithElem(textContainer);
}

export const createTdWithElem = (elem) => {
    const td = document.createElement('td');
    td.appendChild(elem);
    return td;
}

export const createTdWithCode = (text) => {
    const code = wrapTextInCode(text);
    const td = createTdWithP("");
    td.children[0].appendChild(code);
    return td;
}

export const formatString = (s) => { return s.replaceAll("\\n", "\r\n"); }

export function hideHeadBannerElements() {
    const headBanner = document.querySelector("head-banner");

    // Hide the main title, tagline, and button within the head-banner
    const titleElement = headBanner.querySelector(".page-name");
    const tagLineElement = headBanner.querySelector("h2");
    const buttonElement = headBanner.querySelector("button");

    if (titleElement) titleElement.style.display = "none";
    if (tagLineElement) tagLineElement.style.display = "none";
    if (buttonElement) buttonElement.style.display = "none";
}

export function convertToMarkdown() {
    // convert all paragraph elements
    const pElems = document.querySelectorAll('p');
    pElems.forEach((p) =>
        { p.innerHTML = p.innerHTML.replace(/`(.*?)`/g, '<code>$1</code>'); }
    );
}