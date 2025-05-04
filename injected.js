(function () {
    const originalLog = console.log;
  
    console.log = function (...args) {
      try {
        window.dispatchEvent(new CustomEvent('console-log-intercepted', { detail: args }));
      } catch (err) {
        originalLog('SBCL Interceptor Error:', err);
      }
  
      originalLog.apply(console, args);
    };
  })();