//! This only runs on Sparx Maths. Do not put extension code here!

console.log("%cSBCL: Active", 'color:rgb(247, 255, 129)');

////console.log("chrome:", chrome);
////console.log("chrome.storage:", chrome?.storage);
////console.log("chrome.storage.local:", chrome?.storage?.local);

// Inject intercept scripts
const scripts_to_inject = ['intercept_console_log.js', 'intercept_post_response.js'];

for (let i = 0; i < scripts_to_inject.length; i++) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(scripts_to_inject[i]); // External file in extension
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);

    console.log("%cSBCL: Injected " + scripts_to_inject[i] + " " + (i + 1) + "/" + scripts_to_inject.length, 'color:rgb(247, 255, 129)');
}

let active_question;

// Listen for events from page context
window.addEventListener('console-log-intercepted', (e) => {
    const message = e.detail;

    ////console.log(message[0]);
    if (!/SBCL/.test(message[0])) { // Ignores logs from the post response interceptor
        console.log('SBCL Interceptor:', ...e.detail); // Cannot be coloured
        
        
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
        ////console.log("SBCL Message: " + message);
        if (Array.isArray(message) && message[0] == ("[ACT] START")) {
            console.log("%cSBCL: New question started", 'color:rgb(247, 255, 129)');
            ////console.log("SBCL Message: " + message);

            active_question = [message[2], message[3]];

            console.log("%cSBCL: Task " + active_question[0], 'color:rgb(247, 255, 129)');
            console.log("%cSBCL: Question " + active_question[1], 'color:rgb(247, 255, 129)');
        } else if (Array.isArray(message) && message[0] == ("[ACT] question MUTATED - SUCCESS")) { // The provided answer was correct
            ////console.log("%cSBCL: Logging question...");
            chrome.storage.local.get("iterator", function(iter) {
                const iter_value = iter.iterator?.value ?? 0;
                const id = "" + iter_value + active_question[0] + active_question[1]; // EG 012 not 3

                const to_save = {
                    id: id,
                    task: active_question[0],
                    question: active_question[1],
                    answer: false, //! Placeholder
                }

                console.log(to_save);

                chrome.storage.local.set({ [to_save.id]: to_save }, () => {
                    console.log("%cSBCL: Logging question", 'color:rgb(247, 255, 129)');
                });

                chrome.storage.local.get(to_save.id, function(result) {
                    console.log(result);
                });
            });
        }
    }
});