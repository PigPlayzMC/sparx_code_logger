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