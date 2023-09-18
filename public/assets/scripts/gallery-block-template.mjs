const DOMAIN_NAME_ID = "domain-name";
const DOMAIN_DESC_ID = "domain-desc";
const EDITOR_ID = "pddl-editor";
const GITHUB_BTN_ID = "view-source-code";
const PLANIMATION_BTN = "#planimationMenuItem > a";

function addTitle(domainName) {
    const title = document.getElementById(DOMAIN_NAME_ID);
    title.textContent = domainName;
}

function addDescription(domainDesc) {
    const desc = document.getElementById(DOMAIN_DESC_ID);
    desc.textContent = domainDesc;
}

function addAnimation(sessionLink) {
    const editor = document.getElementById(EDITOR_ID);
    editor.src = sessionLink;
}

function addButton(id, text, ref) {
    const btn = document.getElementById(id);
    const link = document.createElement('a');
    link.href = ref;
    link.textContent = text;
    btn.appendChild(link);
}

export function addData(doc) {
    const docData = doc.data();
    addTitle(docData.name);
    addDescription(docData.description);
    addAnimation(docData.sessionLink);
    addButton(GITHUB_BTN_ID, "View source code", docData.githubLink);
}

function insertContent(contentDiv, contentType, content, colour="black") {
    var element = null
    switch (contentType) {
        case "p":
            element = document.createElement("p");
            element.textContent = content;
            element.style.color = colour;
            break;
        case "ol":
            element = document.createElement("ol");
            content.forEach(function(content) {
                var li = document.createElement("li");

                var desc = document.createElement("p");
                desc.textContent = content.text;
                desc.style.fontSize = "14px";
                desc.style.color = colour;

                var image = document.createElement("img");
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

function createCollapsibleButton() {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "collapsible";
    button.innerHTML = "&darr; How to animate";

    var contentDiv = document.createElement("div");
    contentDiv.className = "content";
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

    var container = document.getElementById("animation-guide");
    container.appendChild(button);
    container.appendChild(contentDiv);
}

export function enableCollapsible() {
    createCollapsibleButton();

    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;

        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
        });
    }
}