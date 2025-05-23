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
let last_homework_type = null;
let homework_type;

function find_match() { //* Runs in the event of bookwork checks. Must run several times as document loads after this.
    const code_regex = /\d[A-Z]{1}$/gm;

    const body = document.body.innerText;
    const lines = body.split('\n');

    ////console.log(body);

    let match = null;
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        ////console.log(lines[i]);

        if (code_regex.test(lines[i])) {
            console.log("%cSBCL: Code found: " + lines[i], 'color:rgb(247, 255, 129)');
            match = lines[i];  
            found = true;
        }

        if (found) {
            break;
        }
    }
    const return_val = match;

    return return_val
}

function getFromStorage(key) { // Avoids undefined behaviour when retrieving previous answer type
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => resolve(result));
    });
}

// Listen for events from page context
window.addEventListener('console-log-intercepted', (e) => {
    const message = e.detail;

    ////const retrieved_answers = ["DEBUG USE ONLY", "SECOND DEBUG VALUE"];
    
    ////chrome.runtime.sendMessage({ type: "SEND_ANSWERS", data: retrieved_answers });

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
            homework_type = e.detail.homework_type;
        });

        if (Array.isArray(message) && message[0] == ("[ACT] START")) { //* Begin question
            console.log("%cSBCL: New question started", 'color:rgb(247, 255, 129)');
            ////console.log("SBCL Message: " + message);

            active_question = [message[2], message[3]];

            console.log("%cSBCL: Task " + active_question[0], 'color:rgb(247, 255, 129)');
            console.log("%cSBCL: Question " + active_question[1], 'color:rgb(247, 255, 129)');
        } else if (Array.isArray(message) && message[0] == ("[ACT] question MUTATED - SUCCESS")) { //* Save question
            ////console.log("%cSBCL: Logging question...");
            chrome.storage.local.get("iterator", function(iter) {
                const iter_value = iter.iterator?.value ?? 0;
                const id = "" + iter_value + active_question[0] + active_question[1] + homework_type; // EG 0120 not 3

                if (homework_type !== 9) { // Save question
                    last_homework_type = homework_type;

                    const type_to_save = {
                        id: "homework_type",
                        value: last_homework_type,
                    }

                    chrome.storage.local.set({ [type_to_save.id]: type_to_save }, () => {
                        console.log("%cSBCL: Overwriting last question type", 'color:rgb(247, 255, 129)');
                    });

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
                } else {
                    console.log("%cSBCL: Independent learning detected - Not logging, you don't get bookwork checks", 'color:rgb(247, 255, 129)');
                }
                
            });
        } else if (Array.isArray(message) && /\[ACT\]\sWAC\sSTART/.test(message[0])) { //* Retrieve answer to question
            chrome.storage.local.get("iterator", function(iter) {
                const iter_value = iter.iterator?.value ?? 0;

                setTimeout(() => {
                    const match = find_match();

                    ////while (!match[0]) {
                    ////    // This could be really bad for performance...
                    ////    match = find_match();
                    ////}

                    let code = match; // Not sure if this can error?
                    // ^^ This looks like "Bookwork 3F"

                    ////console.log(code);
                    const task = code[code.length-2];
                    ////console.log(task);
                    const question = code.charCodeAt(code.length-1) - 64;
                    ////console.log(question);

                    (async () => {
                        if (last_homework_type == null || last_homework_type == undefined) {
                            const type = await getFromStorage("homework_type");
                            homework_type = type.homework_type?.value ?? 0;
                            console.log("Type value: " + homework_type);
                        } else {
                            homework_type = last_homework_type;
                        }
                        console.log(homework_type);

                        const id = "" + iter_value + task + question + homework_type;
                        console.log("%cSBCL: Bookwork check started for id " + id, 'color:rgb(247, 255, 129)');

                        chrome.storage.local.get(id, function(result) {
                            console.log("%cSBCL: Code answer(s): ", 'color:rgb(247, 255, 129)');
                            if (Array.isArray(result[id]?.answer)) {
                                let retrieved_answers = []; 

                                for (let ans = 0; ans < result[id].answer.length; ans++) {
                                    console.log("%cSBCL: Answer " + (ans+1) + " - " + result[id].answer[ans], 'color:rgb(247, 255, 129)');
                                    retrieved_answers.push(result[id].answer[ans]);
                                }

                                // Broadcast retrieved answer for popup.js
                                chrome.runtime.sendMessage({ type: "SEND_ANSWERS", data: retrieved_answers });
                                chrome.browserAction.setIcon({ path: "images/128_bookwork" });
                            } else {
                                console.error("SBCL: No answers found for id: " + id);
                            }
                        });
                    })();
                }, 500);
            });
        }
    }
});