(async  () => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;
    
    const itemToInsertContent =
        document.getElementsByClassName("profile_header_centered_persona")
        .item(0);
    const divToInsertContent = itemToInsertContent.parentNode;
    
    const container = document.createElement("div");
    container.innerHTML = (await getHtmlContent()).innerHTML;
    
    divToInsertContent.appendChild(container);
    
    async function getHtmlContent() {
        const dbDirContent = browser.runtime.getURL("page-content/db-directory.html");

        const content = (await (await fetch(dbDirContent)).text());
        const contentDoc = new DOMParser().parseFromString(content, 'text/html');

        const faceit = contentDoc.getElementById("faceit");
        const faceitLogo = browser.runtime.getURL("icons/faceit.png");
        faceit.setAttribute("src", faceitLogo);
        
        return contentDoc.body;
    }
})();

