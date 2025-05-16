// Setup
document.addEventListener("DOMContentLoaded", () => {
    const element = document.getElementById("task1");
    element.addEventListener("click", changePage);

    function changePage() {
        ////console.log("Task " + evt.currentTarget.relatedTask + " clicked");
        window.location.assign("task.html");
    }
});

window.addEventListener('answers-retrieved', (e) => {
    const retrieved_answers = e.detail;
    const element = document.getElementById("last_bookwork_code");

    element.textContent="DEBUG";
    element.classList.remove("hidden");
});

////document.addEventListener("DOMContentLoaded", () => {
////    const logBtn = document.getElementById("logBtn");
////    if (logBtn) {
////        logBtn.addEventListener("click", () => {
////            console.log("Button clicked!");
////        });
////    }
////});
