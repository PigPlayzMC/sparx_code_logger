// Setup
document.addEventListener("DOMContentLoaded", () => {
    const element = document.getElementById("task1");
    element.addEventListener("click", changePage);

    function changePage() {
        ////console.log("Task " + evt.currentTarget.relatedTask + " clicked");
        window.location.assign("task.html");
    }
});

chrome.runtime.sendMessage({ type: "GET_ANSWERS" }, (response) => {
  if (response && response.array) {
    // Display the array in your popup
    document.getElementById("last_bookwork_code").textContent = JSON.stringify(response.array);

    if (JSON.stringify(response.array) == "[null]") {
        console.log("%cSBCL: No bookwork code recently received", 'color:rgb(247, 255, 129)');
        document.getElementById("last_bookwork_code").style.display = "none";
    } else {
        document.getElementById("last_bookwork_code").style.display = "block";
    }
  }
});