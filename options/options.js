function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        steamApiKey: document.querySelector("#steamApiKey").value,
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#steamApiKey").value = result.steamApiKey || "";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("steamApiKey");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
