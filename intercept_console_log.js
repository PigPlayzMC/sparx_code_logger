(function () {
    const original_log = console.log;
    
    console.log = function (...args) {
        try {
            window.dispatchEvent(new CustomEvent('console-log-intercepted', { detail: args }));
        } catch (err) {
            original_log('SBCL: Interceptor Error ', err);
        }
  
        original_log.apply(console, args);
    };
})();