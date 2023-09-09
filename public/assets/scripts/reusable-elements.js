const WEBPAGE_PATH = "assets/"

class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <div class="top-nav-bar">
                    <official-logo></official-logo>
                    <nav><ul class="nav-list">
                        <li><a href="./index.html">Home</a></li>
                        <li><a href="./documentation.html">Documentation</a></li>
                        <li><a href="./gallery.html">Gallery</a></li>
                        <li><a href="./references.html">References</a></li>
                        <li><a href="./suggestions.html">Suggestions</a></li>
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

class MainFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `<footer class="page-footer">
                <img src="${WEBPAGE_PATH}resources/logo.png" alt="Planimation logo" width="40px" height="40px"/>
                <button>
                    return to top
                </button>
                <div class="copyright">Copyright &copy; Team AAAAS</div>
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

class SearchBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <div class="search-bar">
                <button class="search-btn"><img src="${WEBPAGE_PATH}resources/icons/magnifying-glass.png" width="30px" height="30px"></button>
                <input type="text" id="searchInput">
                <style>
                    #searchInput {
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
            </div>
            `
    }

    setTextContent(text) {
        const input = document.querySelector(".search-bar > input");
        input.placeholder = text;
    }

    setOnClick(searchFunction) {
        const btn = document.querySelector(".search-bar > button");
        btn.onClick = searchFunction;
    }
}

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
                  /*word-wrap: break-word;*/
                  white-space: pre-wrap;
                  white-space: -moz-pre-wrap;
                  white-space: -o-pre-wrap;
                  overflow-wrap: break-word;
                  /*word-break: break-all;*/
                  inline-size: 100%;
                }
            </style>
            `
    }

    setTextContent(content) {
        this.children[0].children[0].textContent = content;
    }
}

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

    setTextContent(content) {
        this.children[0].children[0].textContent = content;
    }

    addButton(text, ref) {
        const header = this.children[0];
        const btn = document.createElement('button');
        btn.setAttribute("class", "btn");
        const link = document.createElement('a');
        link.textContent = text;
        link.href = ref;
        btn.appendChild(link);
        header.appendChild(btn);
    }

    addTagLine(text) {
        const header = this.children[0];
        const tagLine = document.createElement("h2");
        tagLine.textContent = text;
        tagLine.style["font-size"] = "20px";
        tagLine.style["font-weight"] = "600";
        tagLine.style["textTransform"] = "uppercase";
        header.appendChild(tagLine);
    }
}

class WebLogo extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <div class="logo">
                <a href="./index.html">
                    <img src="${WEBPAGE_PATH}resources/logo.png" alt="Planimation logo" width='40px' height='40px' class="logo-img">
                    <label class="web-name">Planiwiki</label>
                </a>
            </div>
            <style>
                .logo { 
                    position: fixed; 
                    top: 1%; 
                    left: 0.5%; 
                } 
                .logo-img {
                    float: left;
                }
                
                .web-name {
                    font-weight: 800;
                    text-shadow: 1px 1px 2px gray;
                    font-size: 40px;
                    margin-left: 10px;
                    color: black;
                }
                .logo > a:hover {
                    text-decoration: none;
                }
            </style>
            `
    }
}



customElements.define('nav-bar', NavBar);
customElements.define('main-footer', MainFooter);
customElements.define('search-bar', SearchBar);
customElements.define('code-block', CodeBlock);
customElements.define('head-banner', HeadBanner);
customElements.define('official-logo', WebLogo);

