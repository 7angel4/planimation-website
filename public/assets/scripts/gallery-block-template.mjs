import {createButton} from './util.js'

const DOMAIN_NAME_ID = "domain-name";
const DOMAIN_DESC_ID = "domain-desc";
const EDITOR_ID = "pddl-editor";
const GITHUB_BTN_ID = "view-src-code";

/**
 * Fills in the title element with the given domain name.
 * @param domainName: string representing the domain name, to be displayed as the title
 */
function addTitle(domainName) {
    const title = document.getElementById(DOMAIN_NAME_ID);
    title.textContent = domainName;
}

/**
 * Fills in the description element with the given string.
 * @param domainDesc: string holding the domain description
 */
function addDescription(domainDesc) {
    const desc = document.getElementById(DOMAIN_DESC_ID);
    desc.textContent = domainDesc;
}

/**
 * Links the frame element with the provided session link as its source.
 * @param sessionLink: link to a PDDL editor session, which can display the animation.
 */
function addAnimation(sessionLink) {
    const editor = document.getElementById(EDITOR_ID);
    editor.src = sessionLink;
}

/**
 * Adds the properties to the chosen button.
 * @param id: the button element's id
 * @param text: text to be displayed by the button.
 * @param ref: location url of the button.
 */
function addButton(id, text, ref) {
    const btn = document.getElementById(id);
    btn.type = 'button';
    btn.addEventListener('click', () => { window.location.href = ref; });
    btn.textContent = text;
}

/**
 * Adds all data from the document to their corresponding HTML placeholders.
 * @param doc: document containing the data.
 */
export function addData(doc) {
    const docData = doc.data();
    addTitle(docData.name);
    addDescription(docData.description);
    addAnimation(docData.sessionLink);
    addButton(GITHUB_BTN_ID, "View source code", docData.githubLink);
}

/**
 * Wrap the content in an element, and appends it to the specified content division.
 * @param contentDiv: the HTML `div` element to hold the content wrapper element
 * @param contentType: the type of HTML element to wrap the content
 * @param content: string representing the content to be inserted
 * @param color: color in which the content will be rendered
 */
function insertContent(contentDiv, contentType, content, color="black") {
    let element = null;
    switch (contentType) {
        case "p":
            element = document.createElement("p");
            element.textContent = content;
            element.style.color = color;
            break;
        case "ol":
            element = document.createElement("ol");
            content.forEach(function(content) {
                let li = document.createElement("li");

                let desc = document.createElement("p");
                desc.textContent = content.text;
                desc.style.fontSize = "14px";
                desc.style.color = color;

                let image = document.createElement("img");
                image.src = content.imageSrc;
                image.alt = content.alt;
                image.width = content.width;
                image.height = content.height;
        
                li.appendChild(desc);
                li.appendChild(image);
                element.appendChild(li);
            });
            break;
    }
    contentDiv.appendChild(element);
}

/**
 * Creates a collapsible button.
 */
function createCollapsibleButton() {
    let button = createButton('collapsible', "&darr; How to animate");

    let contentDiv = document.createElement("div");
    contentDiv.className = "collapsible-content";
    contentDiv.style.display = "none";

    // Insert guide content
    const steps = [
        {
            text: "Ensure the PDDL editor below is properly loaded with three files (_ap.pddl, _domain.pddl, _prob.pddl), and the “Planimation” button is visible on the menu bar. \n",
            imageSrc: "../assets/resources/animation-guide/step1-image.png",
            alt: "Step 1 Image",
            width: "600",
            height: "225"
        },
        {
            text: "Click on the “Planimation” button and make sure the Domain / Problem / Animation file names match. \n",
            imageSrc: "../assets/resources/animation-guide/step2-image.png",
            alt: "Step 2 Image",
            width: "300",
            height: "200"
        },
        {
            text: "Click on the “Planimate” button, and the animation should be ready! \n You can adjust the speed of the animation or manually step through each step. \n Enjoy planimating! \n",
            imageSrc: "../assets/resources/animation-guide/step3-image.png",
            alt: "Step 3 Image",
            width: "450",
            height: "300"
        }
    ];
    insertContent(contentDiv, "p", "Animate AI planning problem domains in 3 simple steps! \n");
    insertContent(contentDiv, "ol", steps);
    insertContent(contentDiv, "p", "If any files fail to load, refresh the browser or directly access the PDDL editor.", "red");

    let container = document.getElementById("animation-guide");
    container.appendChild(button);
    container.appendChild(contentDiv);
}

/**
 * Enables the collapsible functionality (expand and collapse content).
 */
export function enableCollapsible() {
    createCollapsibleButton();

    let collapsible = document.getElementsByClassName("collapsible");
    for (let i = 0; i < collapsible.length; i++) {
        collapsible[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;

            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}