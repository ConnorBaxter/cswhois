function saveOptions(e) {
    e.preventDefault();

    function getTypes() {
        let dataTypes = [];
        const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
        for (let item of checkboxes) {
            if (item.checked) {
                dataTypes.push(item.getAttribute("data-type"));
            }
        }

        return dataTypes;
    }

    var siteTypes = getTypes();

    browser.storage.sync.set({
        steamApiKey: document.querySelector("#steamApiKey").value,
        debugMode: document.querySelector("#debugMode").checked,
        sites: siteTypes
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#steamApiKey").value = result.steamApiKey || "";
        document.querySelector("#debugMode").checked = result.debugMode || false;
    }

    function setCheckBoxes(result){
        const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
        for (let item of checkboxes) {
            if (result.sites.indexOf(item.getAttribute("data-type")) != -1) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        }
    }

    function onError(error) {
        console.log(`[cswhois options]: ${error}`);
    }

    let getting = browser.storage.sync.get();
    getting.then(setCurrentChoice, onError);

    let checkboxGetting = browser.storage.sync.get();
    checkboxGetting.then(setCheckBoxes, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
