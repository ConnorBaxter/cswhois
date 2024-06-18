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
            await onError("Failed to get steamId. Probably no API key set.", "getHtmlContent");
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
        async function getVanityUrlFromUrl(url) {
            const idSegRegExp = /(\/id\/[A-z\-]*\/)/g;
            const idVanity = idSegRegExp.exec(url)[0];
            const vanity = idVanity.split('/')[2];

            await onError("Vanity: " + vanity, "getSteamId:getVanityUrlFromUrl");

            return vanity;
        }

        async function getSteamIdFromVanity(url) {
            const apiKeyObj = await browser.storage.sync.get("steamApiKey");
            const apiKey = apiKeyObj.steamApiKey;

            const vanityUrl = await getVanityUrlFromUrl(url);
            const getIdUrl = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${vanityUrl}`

            const response = (await (await fetch(getIdUrl)).json());

            await onError("Api response: " + JSON.stringify(response.response), "getSteamId:getSteamIdFromVanity");
            return response.response.steamid;
        }

        async function isVanityUrl(url) {
            const idSegRegExp = /(\/id\/[A-z\-]*\/)/g;
            return idSegRegExp.test(url);
        }

        async function getSteamIdFromUrl(url) {
            const idSegRegExp = /(\/profiles\/\d*\/)/;
            const profileSteamId = idSegRegExp.exec(url)[0];
            const steamId = profileSteamId.split('/')[2];

            await onError("Steam id from url: " + steamId, "getSteamId:getSteamIdFromUrl");

            return steamId;
        }

        try {
            let steamId;

            if(await isVanityUrl(url)) {
                await onError("Url contained vanity string", "getSteamId");
                steamId = await getSteamIdFromVanity(url);
            } else {
                await onError("Url contained steamid", "getSteamId");
                steamId = await getSteamIdFromUrl(url);
            }

            return steamId;
        } catch (ex) {
            await onError(ex, "getSteamId");
            return undefined;
        }
    }

    async function getEnabledSites(){
        const settingsObj = await browser.storage.sync.get();
        const sitesList = settingsObj.sites;

        return sitesList;
    }

    async function onError(error, functionName)
    {
        const settingsObj = await browser.storage.sync.get();
        if(settingsObj.debugMode) {
            let message;
            if (typeof functionName === 'undefined') {
                message = `[cswhois] ${error}`
            } else {
                message = `[cswhois (${functionName})] ${error}`
            }

            console.log(message);
        }
    }
})();
