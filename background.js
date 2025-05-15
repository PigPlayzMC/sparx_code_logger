console.log("%cSBCL: Background setup begun", 'color:rgb(247, 255, 129)');

function clear() {
    // Clears all chrome.storage.local contents for the extension
    chrome.storage.local.clear();
    iter_value = undefined;
}

function list(devMode) {
    // List all items in local storage
    // Debug only
    if (devMode) {

    } else {
        console.error("Error listing: No permissions");
    }
}

chrome.storage.local.get("iterator", function(result) {
    let iter_value = result.iterator;

    chrome.management.getSelf(function(extensionInfo) {
        let install = extensionInfo.installType;

        if (install === 'development') {
            console.warn("SBCL: Development mode active"); // Shouldn't be error
            console.log("%cSBCL: Clearing local storage...", 'color:rgb(247, 255, 129)');
            clear(); // Remove in production
        } else {
            console.log("%cSBCL: Standard install detected", 'color:rgb(247, 255, 129)');
        }

        if (typeof iter_value === 'undefined') {
            console.warn("SBCL: Iterator undefined");
            console.log("%cSBCL: Initiating setup...", 'color:rgb(247, 255, 129)');

            const iterator = {
                id: "iterator",
                value: 0,
            }
        
            chrome.storage.local.set({ [iterator.id]: iterator }, () => {
                console.warn("SBCL: Iterator not found. This is expected behaviour for initial setup or indicates a fault in local storage.");
            });
        
            iter_value = 0;
        } else {
            console.log("%cSBCL: Current iterator = " + iter_value, 'color:rgb(247, 255, 129)');
        }
    });
});