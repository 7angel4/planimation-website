/**
 * Gets the HTML code to embed the specified YouTube video.
 * @param link: URL of the video demo on YouTube
 * @returns the HTML code required to embed the given YouTube video
 */
export const getYouTubeEmbedding = (link) => {
    return `<iframe width="560" height="315" src=${link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
};