const ASSETS_PATH = "/assets/";

/**
 * Custom HTML Element representing a navigation bar.
 */
class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <div class="top-nav-bar">
                    <official-logo></official-logo>
                    <nav><ul class="nav-list">
                        <li><a href="/index.html" class="to-home">Home</a></li>
                        <li><a href="/animation-language.html" class="to-documentation">Animation Language</a></li>
                        <li><a href="/gallery.html" class="to-gallery">Gallery</a></li>
                        <li><a href="/references.html" class="to-references">References</a></li>
                        <li><a href="/suggestions.html" class="to-suggestions">Suggestions</a></li>
                    </ul></nav>
                </div>
                <style>
                    .nav-list > li {
                        display: inline-block;
                        list-style-type: none;
                        padding: 10px 30px;
                        font-weight: bold;
                        width: auto;
                    }
        
                    .top-nav-bar {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        
                        position: fixed; /* hanging at the top */
                        top: 0;
                        background-color: white;
                        width: 100vw;
                    }
                </style>
            </header>
        `
    }
}

/**
 * Custom HTML Element representing the main footer (featuring the logo and copyright symbol).
 */
class MainFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `<footer class="page-footer">
                <img src="${ASSETS_PATH}resources/logo.png" alt="Planimation logo" width="40px" height="40px"/>
                <div class="copyright">By Team AAAAS</div>
                <style>
                    .page-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: black;
                        position: sticky;
                        bottom: 0;
                        background-color: white;
                        padding: 1rem 2rem;
                    }

                </style>
            </footer>
            `
    }
}

/**
 * Custom HTML Element representing a formatted code block.
 */
class CodeBlock extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <pre><code class="formatted-code"></code></pre>
            <style>
                pre {
                  background-color: #e8e8e8;
                  border: 1px solid gray;
                  display: block;
                  padding: 20px;
                  border-radius: 0.5rem;
                  white-space: pre-wrap;
                  overflow-wrap: break-word;
                  inline-size: 100%;
                }
            </style>
            `
    }

    /**
     * Sets the text content of the main heading.
     * @param text: string to be displayed as the main heading.
     */
    setTextContent(text) {
        this.querySelector('.formatted-code').textContent = text;
    }
}

const MAIN_TAGLINE_STYLE = {
    'font-size': '20px',
    'font-style': 'normal',
    'font-weight': '600',
    'text-transform': 'uppercase'
};

const SUB_TAGLINE_STYLE = {
    'font-size': '18px',
    'font-style': 'italic',
    'font-weight': '500',
    'text-transform': 'none'
};

/**
 * Custom HTML Element representing a head banner, optionally featuring a tagline and button.
 */
class HeadBanner extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <header class="page-header"><h1 class="page-name"></h1></header>
            <style>
                .page-header {
                    color: black;
                    text-align: center;
                    background-color: white;
                    margin: 50px auto 0 auto;
                    width: 100vw;
                }
                h1.page-name {
                    font-size: 40px;
                    font-weight: 700;
                    text-transform: uppercase;
                    width: 600px;
                    margin: auto;
                }
            </style>
            `
    }

    /**
     * Sets the text content of the main heading.
     * @param text: string to be displayed as the main heading.
     */
    setTextContent(text) {
        let heading = this.querySelector('h1');
        heading.textContent = text;
    }

    addButton(text, ref, className) {
        const header = this.children[0];
        const btn = document.createElement('button');
        btn.setAttribute('class', 'btn');
        btn.addEventListener('click', function() {
            window.location.href = ref;
        });

        btn.type = 'button';
        btn.textContent = text;
        btn.classList.add(className);
        header.appendChild(btn);
    }

    /**
     * Adds a tagline to the head banner.
     * @param text: string to be displayed as the tagline.
     * @param fontStyles: css style for the text to be displayed.
     */
    addTagLine(text, fontStyles) {
        const header = this.children[0];
        const tagLine = document.createElement("h2");
        tagLine.textContent = text;
        tagLine.style['font-size'] = fontStyles['font-size'];
        tagLine.style['font-style'] = fontStyles['font-style'];
        tagLine.style['font-weight'] = fontStyles['font-weight'];
        tagLine.style['text-transform'] = fontStyles['text-transform'];
        header.appendChild(tagLine);
    }

    /**
     * Adds the main tagline to the head banner.
     * @param text: string to be displayed as the tagline.
     */
    addMainTagLine(text) {
        this.addTagLine(text, MAIN_TAGLINE_STYLE);
    }

    /**
     * Adds the sub tagline to the head banner.
     * @param text: string to be displayed as the tagline.
     */
    addSubTagLine(text) {
        this.addTagLine(text, SUB_TAGLINE_STYLE);
    }
}

/**
 * Custom HTML Element representing the web logo, which is linked to the home page.
 */
class WebLogo extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <div class="logo">
                <a href="/index.html" class="to-home">
                    <img src="${ASSETS_PATH}resources/logo.png" alt="Planimation logo" width='40px' height='40px' class="logo-img">
                    <p class="web-name">Planiwiki</p>
                </a>
            </div>
            <style>
                .logo { 
                    position: fixed; 
                    top: 1%; 
                    left: 0.5%; 
                } 
                .robot-img {
                    float: left;
                }
                
                .web-name {
                    font-weight: 800;
                    text-shadow: 1px 1px 2px gray;
                    font-size: 40px;
                    margin-left: 10px;
                    color: black;
                    display: inline;
                }
                .logo > a:hover {
                    text-decoration: none;
                }
            </style>
            `
    }
}

// Define all the custom elements
customElements.define('nav-bar', NavBar);
customElements.define('main-footer', MainFooter);
customElements.define('code-block', CodeBlock);
customElements.define('head-banner', HeadBanner);
customElements.define('official-logo', WebLogo);