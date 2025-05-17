console.log("%cSBCL: popup.js running", 'color:rgb(247, 255, 129)');

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
    let answers = JSON.stringify(response.array);

    answers = answers.replace(/[\["\]]/g, ''); // Remove [, ], and "
    answers = answers.replace(/,/g, ', '); // Spacing

    if (answers == "null") {
        console.log("%cSBCL: No bookwork code recently received", 'color:rgb(247, 255, 129)');
        document.getElementById("last_bookwork_code").textContent = "No bookwork code recently received";
    } else {
        // Display the array in your popup
        document.getElementById("last_bookwork_code").textContent = answers;
    }
  }
});