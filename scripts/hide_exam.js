// This code is used by anything that is shared between students and lecturers.
// It checks who is using the website and hides the exam bank accordingly

if (window.name == "Student") {
    // Searches for all items with the class "lecturer" and hides them
    const nodeList = document.querySelectorAll(".lecturer");
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].style.display = "none";
    }
}

document.getElementById("currentUser").innerHTML = ("Logged in as " + window.name);