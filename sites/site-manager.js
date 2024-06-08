class SiteManager
{
    SteamId = "";
    Doc = {};
    
    iconStyling = "height: 32px; width: 32px; padding: 2px;";
    
    constructor(steamId, document) {
        this.SteamId = steamId;
        this.Doc = document;
    }
    
    async AddAllEnabled(enabledSites) {
        if(enabledSites.includes("leetifyEnabled")) {
            await this.#addLeetify();
        }
        if(enabledSites.includes("faceitEnabled")) {
            await this.#addFaceit();
        }
        if(enabledSites.includes("csstatsEnabled")) {
            await this.#addCsstats();
        }
        if(enabledSites.includes("steamrepEnabled")) {
            await this.#addStemRep();
        }
        if(enabledSites.includes("csfloatEnabled")) {
            await this.#addCsFloat();
        }

        return this;
    }

    async Build(){
        return this.Doc;
    }
    
    async #addSite(name, url){
        const el = this.Doc.getElementById(`${name}`);
        const linkEl = this.Doc.getElementById(`${name}Link`);
        const logo = browser.runtime.getURL(`icons/${name}.png`);
        el.setAttribute("src", logo);
        el.setAttribute("style", this.iconStyling);
        linkEl.setAttribute("href", url);
        
        return this;
    }
    
    async #addLeetify(){
        const leetifyUrl = `https://leetify.com/app/profile/${this.SteamId}`;
        return await this.#addSite("leetify", leetifyUrl);
    }
    
    async #addFaceit(){
        const faceitUrl = `https://faceitfinder.com/profile/${this.SteamId}`;
        return await this.#addSite("faceit", faceitUrl);
    }
    
    async #addCsstats(){
        const csstatsUrl = `https://csstats.gg/player/${this.SteamId}`;
        return await this.#addSite("csstats", csstatsUrl);
    }

    async #addStemRep() {
        const steamRepUrl = `https://steamrep.com/search?q=${this.SteamId}`;
        return await this.#addSite("steamrep", steamRepUrl);
    }

    async #addCsFloat() {
        const csfloatUrl = `https://csfloat.com/db?min=0&max=1&steamId=${this.SteamId}`;
        return await this.#addSite("csfloat", csfloatUrl);
    }
}