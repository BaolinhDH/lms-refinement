// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

// When any checkboxes are ticked, process changes accordingly
function tickHandler(checkbox, userInputName) {
    // Get all checkboxes with the name "correctChoice"
    var checkboxes = document.getElementsByName(userInputName);
    // Checks each checkboxes under that name. If its not the same
    // checkbox as the one in the arguement, unticks it.
    checkboxes.forEach(function(item) {
        if (item !== checkbox) {
            item.checked = false;
        }
    });
}