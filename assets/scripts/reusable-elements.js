class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <div class="top-nav-bar">
                    <img src="/assets/resources/icons/planimation_logo.png" alt="planimation logo" class="logo"/>
                    <nav><ul class="nav-list">
                        <li><a href="./index.html">Home</a></li>
                        <li><a href="./documentation.html">Documentation</a></li>
                        <li><a href="./gallery.html">Gallery</a></li>
                        <li><a href="./references.html">References</a></li>
                        <li><a href="./suggestions.html">Suggestions</a></li>
                    </ul></nav>
                </div>
                <style>
                    .logo {
                        width: 60px;
                        height: 60px;
                    }
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

class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `<footer class="page-footer">
                <img src="/assets/resources/icons/planimation_logo.png" alt="planimation logo" class="logo"/>
                <button>
                    return to top
                </button>
                <div class="copyright">
                    Copyright © Team AAAAS
                </div>
                <style>
                    .page-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: black;
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
                <input type="text" id="searchInput">
                <button onClick=searchDocuments()>Search</button>
                <style>
                    input button {
                        text-align: center;
                    }
                    input {
                        padding: 5px 100px;
                    }
                    .search-bar {
                        display: flex;
                        justify-content: center; 
                    }
                </style>
            </div>
            `
    }

    setTextContent(text) {
        const input = document.querySelector(".search-bar > input");
        input.placeholder = text;
    }

    setOnKeyUp(searchFunction) {
        const input = document.querySelector(".search-bar > input");
        input.onkeyup = searchFunction;
    }
}

class CodeBlock extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <pre><code></code></pre>
            <style>
                pre {
                  background-color: #e8e8e8;
                  border: 1px solid gray;
                  display: block;
                  padding: 20px;
                  border-radius: 0.5rem;
                }
            </style>
            `
    }

    setCodeContent(content) {
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
                    margin: 50px auto 10px auto;
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
        link.style["color"] = "white";
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
                    <img src="../assets/resources/logo.png" alt="Planiwiki logo" width='40px' height='40px'>
                    <label class="web-name">Planiwiki</label>
                </a>
            </div>
            <style>
                .logo { 
                    position: fixed; 
                    top: 1%; 
                    left: 1%; 
                    z-index: 10;
                } 
                .logo > a > img {
                    display: inline-block;
                }
                .web-name {
                    display: inline-block;
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
customElements.define('main-footer', Footer);
customElements.define('search-bar', SearchBar);
customElements.define('code-block', CodeBlock);
customElements.define('head-banner', HeadBanner);

