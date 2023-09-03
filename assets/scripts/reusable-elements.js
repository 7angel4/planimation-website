class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <div class="top-nav-bar">
                    <nav><ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="documentation.html">Documentation</a></li>
                        <li><a href="gallery.html">Gallery</a></li>
                        <li><a href="references.html">References</a></li>
                        <li><a href="suggestions.html">Suggestions</a></li>
                    </ul></nav>
                </div>
                <style>
                    li {
                        display: inline-block;
                        list-style-type: none;
                        padding: 14px 30px;
                    }
        
                    .top-nav-bar {
                        text-align: center;
                        overflow: hidden;
                        display: flex;
                        justify-content: center;
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
                <input type="text" id="searchInput" placeholder="Search for a document...">
                <button onClick=searchDocuments()>Search</button>
            </div>
            `
    }
}

customElements.define('nav-bar', NavBar);
customElements.define('main-footer', Footer);
customElements.define('search-bar', SearchBar);