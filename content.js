//! This only runs on Sparx Maths. Do not put extension code here!

console.log("%cSBCL: Active", 'color:rgb(247, 255, 129)');

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js'); // External file in extension
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

// Listen for events from page context
window.addEventListener('console-log-intercepted', (e) => {
    console.log('SBCL Interceptor:', ...e.detail); // Cannot be coloured
    
    const message = e.detail;
    ////console.log(message);
    ////console.log("SBCL Raw Message Type:", typeof message);

    // Example of saved:
    // [ACT] START,fd36758f-4f25-4b05-953b-8e66030f8240,2,4,

    // Examples of default e.detail:
    // [ACT] START fd36758f-4f25-4b05-953b-8e66030f8240 2 2 undefined
    // [ACT] START fd36758f-4f25-4b05-953b-8e66030f8240 2 3 undefined
    // [ACT] START fd36758f-4f25-4b05-953b-8e66030f8240 2 4 undefined
    // [ACT] START fd36758f-4f25-4b05-953b-8e66030f8240 2 5 undefined
    // [ACT] START fd36758f-4f25-4b05-953b-8e66030f8240 2 6 undefined
    // [ACT] START fd36758f-4f25-4b05-953b-8e66030f8240 2 7 undefined
    // [ACT] START fd36758f-4f25-4b05-953b-8e66030f8240 2 8 undefined
    if (Array.isArray(message) && message[0] == ("[ACT] START")) {
        console.log("%cSBCL: New question started", 'color:rgb(247, 255, 129)');
        ////console.log("SBCL Message: " + message);

        const task = message[2];
        const question = message[3]; // Int rather than char

        console.log("%cSBCL Task: " + task, 'color:rgb(247, 255, 129)');
        console.log("%cSBCL Question: " + question, 'color:rgb(247, 255, 129)');
    }
});