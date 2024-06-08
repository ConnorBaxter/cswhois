class SiteManager
{
    SteamId = "";
    Doc = {};
    
    iconStyling = "height: 32px; width: 32px; padding: 2px;";
    
    constructor(steamId, document) {
        this.SteamId = steamId;
        this.Doc = document;
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
    
    async AddLeetify(){
        const leetifyUrl = `https://leetify.com/app/profile/${this.SteamId}`;
        return await this.#addSite("leetify", leetifyUrl);
    }
    
    async AddFaceit(){
        const faceitUrl = `https://faceitfinder.com/profile/${this.SteamId}`;
        return await this.#addSite("faceit", faceitUrl);
    }
    
    async AddCsstats(){
        const csstatsUrl = `https://csstats.gg/player/${this.SteamId}`;
        return await this.#addSite("csstats", csstatsUrl);
    }
}