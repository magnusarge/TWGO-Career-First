const pilotNameInput = document.querySelector("#pilotName");

/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {
    browser.storage.local.set({
      pilotName: pilotNameInput.value || ""
    });
}

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {
    pilotNameInput.value = restoredSettings.pilotName || "";
}

function onError(e) {
    console.error(e);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
On blur, save the currently selected settings.
*/
pilotNameInput.addEventListener("blur", storeSettings);