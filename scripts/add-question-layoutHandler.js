let currentOption;
let currentNumOfCorrectAnswers;

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
}

// Hides all answer boxes
function addQuestionHideList() {
    document.getElementById("answer1").style.display = "none";
    document.getElementById("answer2").style.display = "none";
    document.getElementById("answer3").style.display = "none";
    document.getElementById("answer4").style.display = "none";
    document.getElementById("answer5").style.display = "none";
}

// Shows all answer boxes
function addQuestionDisplayList() {
    document.getElementById("answer1").style.display = "";
    document.getElementById("answer2").style.display = "";
    document.getElementById("answer3").style.display = "";
    document.getElementById("answer4").style.display = "";
    document.getElementById("answer5").style.display = "";
}

// Reset all checkboxes when changing from Multiple Choice (4) to Multiple Answers (5) and vice versa
function resetAnswers() {
    var answerList = document.querySelector('.answer_list'); // Get the answer_list div

    // Clear checkboxes
    var checkboxes = answerList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
}

// When the question type is chosen, show answer boxes accordingly
function showAnswers(sel) {
    // When multiple choice (4) is chosen, shows all 5 boxes and hides the 5th one
    if(sel.options[sel.selectedIndex].value == "multipleChoice") {
        currentOption = "multipleChoice";
        addQuestionDisplayList();
        document.getElementById("answer5").style.display = "none";
    }
    // When multiple choice (5) is chosen, shows all 5 boxes
    else if(sel.options[sel.selectedIndex].value == "multipleAnswers") {
        currentOption = "multipleAnswers";
        currentNumOfCorrectAnswers = 0;
        addQuestionDisplayList();        
    }
    // Otherwise hide all answer boxes
    else {
        currentOption = "";
        addQuestionHideList();
    }
}

// Resets all checkboxes and shows answers accordingly
function selectionChangeHandler(sel) {
    resetAnswers();
    showAnswers(sel);
}

// When any checkboxes are ticked, process changes accordingly
function tickHandler(inputID, checkbox) {
    // If the user chooses Multiple Choice (4), when the user changes their
    // selection, automatically unticks the previous one
    if(currentOption == "multipleChoice") {
        // Get all checkboxes with the name "correctChoice"
        var checkboxes = document.getElementsByName('correctChoice');
        // Checks each checkboxes under that name. If its not the same
        // checkbox as the one in the arguement, unticks it.
        checkboxes.forEach(function(item) {
            if (item !== checkbox) {
                item.checked = false;
            }
        });
    }

    // If the user chooses Multiple Answers (5), makes sure the user can
    // only mark 2 answers as correct ones
    else if(currentOption == "multipleAnswers") {
        let userInput = document.getElementById(inputID);
        // If the user ticks something and two already exists, it will be
        // automatically unticked and an alarm will pop up reminding the user
        // that there can only be 2 correct answers
        if(userInput.checked == true && currentNumOfCorrectAnswers >= 2) {
            userInput.checked = false;
            alert("You cannot have more than 2 correct answers");
        }
        // If a tick is ticked or unticked, update the current number of correct answers
        else if(userInput.checked == false) {
            currentNumOfCorrectAnswers--;
        }
        else {
            currentNumOfCorrectAnswers++;
        }
    }
}