class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <div class="top-nav-bar">
                    <nav><ul class="nav-list">
                        <li><a href="/index.html">Home</a></li>
                        <li><a href="/documentation.html">Documentation</a></li>
                        <li><a href="/gallery.html">Gallery</a></li>
                        <li><a href="/references.html">References</a></li>
                        <li><a href="/suggestions.html">Suggestions</a></li>
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
                        text-align: center;
                        display: block;
                        justify-content: center;
                        overflow: hidden;
                        
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
                <span>
                    This page is maintained by <a href="https://github.com/7angel4">@7angel4</a>.<br>
                    Last updated: <time>15/08/2023</time><br><br>
                </span>
            </footer>
            `

    }
}

class SearchBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Search for a function...">
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


customElements.define('nav-bar', NavBar);
customElements.define('main-footer', Footer);
customElements.define('search-bar', SearchBar);
customElements.define('code-block', CodeBlock);