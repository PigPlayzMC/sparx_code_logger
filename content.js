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
    if (!/SBCL:/.test(message[0])) { // Ignores logs from the post response interceptor
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

        let latest_final_answers = [];

        window.addEventListener('sbcl-answers-found', (e) => {
            latest_final_answers = e.detail.final_answers;
        });

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

                try {
                    if (latest_final_answers == []) {
                        console.error("SBCL: No answer found");
                    } else {
                        const to_save = {
                            id: id,
                            task: active_question[0],
                            question: active_question[1],
                            answer: latest_final_answers,
                        }

                        console.log(to_save);

                        chrome.storage.local.set({ [to_save.id]: to_save }, () => {
                            console.log("%cSBCL: Logging question", 'color:rgb(247, 255, 129)');
                        });

                        chrome.storage.local.get(to_save.id, function(result) {
                            console.log(result);
                        });
                    }
                } catch {
                    console.error("SBCL: Failed to log answers");
                }
            });
        } else if (Array.isArray(message) && /\[ACT\]\sWAC\sSTART/.test(message[0])) {
            chrome.storage.local.get("iterator", function(iter) {
                const iter_value = iter.iterator?.value ?? 0;
                const id = "" + iter_value + message[2] + message[3];

                //TODO Remove this debug block
                const to_save = {
                    id: "022",
                    task: 2,
                    question: 2,
                    answer: ['DEBUG USE ONLY'],
                }

                chrome.storage.local.set({ [to_save.id]: to_save }, () => {
                    console.warn("SBCL: Logging debug code. This is not intended production behaviour. Please report this message.")
                });
                //TODO Debug code ends

                console.log("%cSBCL: Bookwork check started for id " + id, 'color:rgb(247, 255, 129)');

                chrome.storage.local.get(id, function(result) {
                    ////console.log(typeof result[id].answer);

                    console.log("%cSBCL: Code answer(s): ", 'color:rgb(247, 255, 129)');
                    if (Array.isArray(result[id]?.answer)) {
                        let retrieved_answers = []; 

                        for (let ans = 0; ans < result[id].answer.length; ans++) {
                            console.log("%cSBCL: Answer " + (ans+1) + " - " + result[id].answer[ans], 'color:rgb(247, 255, 129)');
                            retrieved_answers.push(result[id].answer[ans]);
                        }

                        // Broadcast retrieved answer for popup.js
                        try {
                            window.dispatchEvent(new CustomEvent('answers-retrieved', {detail: retrieved_answers}));
                        } catch (err) {
                            console.error("SBCL: Answer broadcast error ", err)
                        }
                    } else {
                        console.error("SBCL: No answers found for id: " + id);
                    }
                });
            });
        }
    }
});