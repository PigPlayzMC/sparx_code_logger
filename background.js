console.log("%cSBCL: Background setup begun", 'color:rgb(247, 255, 129)');
let iter_value;

try {
    chrome.storage.local.get("iterator", (result) => {
        console.log("%cSBCL: Iterator " + result[1], 'color:rgb(247, 255, 129)');
        iter_value = result[1];
    });
} catch {
    const iterator = {
        id: "iterator",
        value: 0,
    }

    chrome.storage.local.set({ [iterator.id]: iterator }, () => {
        console.warn("SBCL: Iterator not found. This is expected behaviour for initial setup or indicates a fault in local storage.");
    });

    iter_value = 0;
}