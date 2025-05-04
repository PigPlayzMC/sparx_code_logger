// Listen for clicks on task buttons
document.addEventListener("DOMContentLoaded", () => {
    const element = document.getElementById("task1");
    element.addEventListener("click", changePage);
    element.relatedTask = 1;

    function changePage(evt) {
        ////console.log("Task " + evt.currentTarget.relatedTask + " clicked");
        window.location.assign("task.html");
    }
})

////document.addEventListener("DOMContentLoaded", () => {
////    const logBtn = document.getElementById("logBtn");
////    if (logBtn) {
////        logBtn.addEventListener("click", () => {
////            console.log("Button clicked!");
////        });
////    }
////});
