// Intercept XMLHttpRequest responses
(function () {
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._method = method; // Store the request method
        this._url = url;       // Store the request URL
        return originalXhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            if (this._method === 'POST') {
                handle_text(this.responseText);
                ////console.log('SBCL: Intercepted POST Response:', this.responseText);
            }
        });
        return originalXhrSend.apply(this, arguments);
    };
})();

// Intercept fetch responses
(function () {
    const originalFetch = window.fetch;

    window.fetch = async function (input, init) {
        const response = await originalFetch.apply(this, arguments);

        if (init?.method === 'POST') {
            const clonedResponse = response.clone(); // Clone the response to avoid consuming it
            clonedResponse.text().then((text) => {
                handle_text(text);
                // Process or modify the response here if necessary
            });
        }
        return response; // Return the original response
    };
})();

function handle_text(text) {
    console.log('SBCL: Intercepted POST Response:' + text);
}

// Examples of responses minus most unknown chars;
//* Notes
// Multiple choices appear to use <slot> whereas single choices use <choice> and numbers use <number>
// Must remove $ chars on both side and other weirdness found in multiple clickable choice example
// Independent learning may be identified from use of the word 'revision'

//* Single draggable choice (Independent learning)
// VV This seems to be the important line so will be the only line showcased in later examples VV
// QSUCCESS2D<steps><answer><part><choice>Dublin</choice></part></answer></steps>8
// $84e34af1-0989-4c18-9865-02580d5afc14"Ordering negative numbers*revision08@PXbCONTENTS_GENERATEDr? *@?C@CFT@QV"@$84e34af1-0989-4c18-9865-02580d5afc14
//  Introduce"NORMAL08@Z?@?CFT@QV@C@b{}xB$84e34af1-0989-4c18-9865-02580d5afc14 (JQuestion 2x�

//* Multiple draggable choices (Independent learning)
// SUCCESS2�<steps><answer><part><slot>$-770$</slot><slot>$-77$</slot><slot>$-17$</slot><slot>$7$</slot><slot>$70$</slot><slot>$700$</slot></part></answer></steps>8

//* Single clickable choice (Independent learning)
// SUCCESS2C<steps><answer><part><choice>$700$</choice></part></answer></steps>8

//* Multiple clickable choices (Independent learning)
// SUCCESS2�<steps><answer><part><text>A) $\phantom{-}2$</text><slot>$&gt;$</slot><text>$-6$</text></part><part><text>B) $-7$</text><slot>$&lt;$</slot><text>$-3$</text></part><part><text>C) $-5$</text><slot>$&gt;$</slot><text>$-8$</text></part></answer></steps>8#
// gt appears to equal >
// ls appears to equal <

//* Single numerical choice (Independent learning)
// SUCCESS2B<steps><answer><part><number>-1.3</number></part></answer></steps>8

//* Multiple numerical choices *This also features a 'I have written an explanation' box* (Homework)
// SUCCESS2�<steps><answer><part><text>a) $f=$</text><number>-3</number></part><part><text>$g=$</text><number>2</number></part><part><text>b) I</text><slot>have</slot><text>written an explanation</text></part></answer></steps>8

