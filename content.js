console.log("Sparx Maths detected - Extension active...");

const path = window.location.pathname; // e.g., /task/2/item/1
const match = path.match(/task\/(\d+)\/item\/(\d+)/);
console.log("Question path: " + match);

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js'); // External file in extension
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

// Listen for events from page context
window.addEventListener('console-log-intercepted', (e) => {
  console.log('Intercepted log from page:', ...e.detail);
});


//const path = window.location.pathname; // e.g., /task/2/item/1
//const match = path.match(/task\/(\d+)\/item\/(\d+)/);