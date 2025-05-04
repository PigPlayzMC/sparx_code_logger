//! This only runs on Sparx Maths. Do not put extension code here!

console.log("SBCL: Active");

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js'); // External file in extension
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

// Listen for events from page context
window.addEventListener('console-log-intercepted', (e) => {
    console.log('SBCL Interceptor:', ...e.detail);
});