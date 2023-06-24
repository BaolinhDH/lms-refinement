// A function that allows the user to input a string, and it will search
// for any course that has the input in its name and hides the rest
function searchCard() {
    // Takes the user input and make them uppercase
    let input = document.getElementById("searchInput").value.toUpperCase();
    // Selects all items with the tag courseCard
    const courseCard = document.querySelectorAll(".courseCard");
    // Iterate through each
    for(let i = 0; i < courseCard.length; i++) {
        var cardHeader, courseName, a, txtValue;
        // Access the div with the "cardHeader" class
        cardHeader = courseCard[i].getElementsByClassName("cardHeader")[0];
        // Access the "h2" tag within the cardHeader
        courseName = cardHeader.getElementsByTagName("h2")[0];
        // Access the "a" tag within the courseName
        a = courseName.getElementsByTagName("a")[0];
        // Take the text within the "a" tag and make them uppercase
        txtValue = a.textContent.toUpperCase() || a.innerText.toUpperCase();
        // Check if any of the names contain the input
        // If it does, leave it visible, otherwise, hide it
        if (txtValue.indexOf(input) > -1) {
            courseCard[i].style.display = "";
        }
        else {
            courseCard[i].style.display = "none";
        }
    }
}

// A function that resets the search bar on click and shows all courses
function resetSearch() {
    // Selects all items with the tag courseCard
    const courseCard = document.querySelectorAll(".courseCard");
    // Iterate through each
    for(let i = 0; i < courseCard.length; i++) {
        // Shows the course
        courseCard[i].style.display = "";
    }
}

document.getElementById("resetBtn").onclick = function() {resetSearch()};
document.getElementById("searchInput").onkeyup = function() {searchCard()};