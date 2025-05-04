//! This only runs on Sparx Maths. Do not put extension code here!

console.log("SBCL: Active");

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js'); // External file in extension
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

// Listen for events from page context
window.addEventListener('console-log-intercepted', (e) => {
    console.log('SBCL Interceptor:', ...e.detail);
    const message = e.detail;

    // Example: [ACT] START fd36758f-4f25-4b05-953b-8e66030f8240 2 2 undefined
    if (message.includes(undefined)) {
        console.log("SBCL: New question started");

        
    }
});