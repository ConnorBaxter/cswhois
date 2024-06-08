(async  () => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    const itemToInsertContent = document.getElementsByClassName("profile_header_centered_persona").item(0);
    const divToInsertContent = itemToInsertContent.parentNode;

    const container = document.createElement("div");
    container.innerHTML = (await getHtmlContent()).innerHTML;

    divToInsertContent.appendChild(container);

    async function getHtmlContent() {
        const steamId = await getSteamId(window.location + "/");

        if(!steamId){
            return await getErrorHtmlContent();
        }

        const sitesContent = browser.runtime.getURL("page-content/sites.html");
        const contentHtml = (await (await fetch(sitesContent)).text());
        const contentDoc = new DOMParser().parseFromString(contentHtml, 'text/html');

        const siteManager = new SiteManager(steamId, contentDoc);
        await siteManager.AddAllEnabled(await getEnabledSites());

        const content = await siteManager.Build();
        return content.body;
    }

    async function getErrorHtmlContent(){
        const dbDirContent = browser.runtime.getURL("page-content/error.html");
        const content = (await (await fetch(dbDirContent)).text());
        const contentDoc = new DOMParser().parseFromString(content, 'text/html');

        return contentDoc.body;
    }

    async function getSteamId(url) {
        try {
            const apiKeyObj = await browser.storage.sync.get("steamApiKey");
            const apiKey = apiKeyObj.steamApiKey;

            const vanityUrl = await getVanityUrlFromUrl(url);
            const getIdUrl = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${vanityUrl}`

            const response = (await (await fetch(getIdUrl)).json());
            const steamId = response.response.steamid;

            return steamId;
        } catch (ex) {
            await onError(ex);
            return undefined;
        }
    }

    async function getEnabledSites(){
        const settingsObj = await browser.storage.sync.get();
        const sitesList = settingsObj.sites;

        return sitesList;
    }

    async function getVanityUrlFromUrl(url) {
        const idsegRegExp = /(\/id\/[A-z]*\/)/;

        const idVanity = idsegRegExp.exec(url)[0];

        const vanity = idVanity.split('/')[2];

        return vanity;
    }

    async function onError(error) {
        console.log(`[cswhois] ${error}`);
    }
})();
