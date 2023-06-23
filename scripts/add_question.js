// exambank.js
// Contains script content necessary for the functionality of all exam bank pages + assignment page where completed exams go.
// Remember to port necessary information from files in data folder onto the page using the scripts @Huy @Chi. You can also feel free to split this script up into multiple files if you need

// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

let currentOption;
let currentNumOfCorrectAnswers;

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

    // Clear radio buttons
    var radioButtons = answerList.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(function(radioButton) {
        radioButton.checked = false;
    });

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

// Takes the user input and add the question to the exam bank
function addQuestion() {
    // Checks if a question is ticked
    // If it is, change said question's div's value to correct
    if(document.getElementById("A_correct").checked == true) {
        document.getElementById("answer1").setAttribute("value", "correct")
    }
    if(document.getElementById("B_correct").checked == true) {
        document.getElementById("answer2").setAttribute("value", "correct")
    }
    if(document.getElementById("C_correct").checked == true) {
        document.getElementById("answer3").setAttribute("value", "correct")
    }
    if(document.getElementById("D_correct").checked == true) {
        document.getElementById("answer4").setAttribute("value", "correct")
    }
    if(document.getElementById("E_correct").checked == true) {
        document.getElementById("answer5").setAttribute("value", "correct")
    }

    // Get all question inputs
    let question = document.getElementById("questionInput").value;
    let topic = document.getElementById("topicChoice").value;
    let type = document.getElementById("questionType").value;
    let currentDate = new Date().toJSON().slice(0, 10);

    // Get all answers input
    let answerA = document.getElementById("answerA").value;
    let answerB = document.getElementById("answerB").value;
    let answerC = document.getElementById("answerC").value;
    let answerD = document.getElementById("answerD").value;
    let answerE = document.getElementById("answerE").value;

    // Get all correct values
    let answerA_correct = document.getElementById("answer1").getAttribute("value");
    let answerB_correct = document.getElementById("answer2").getAttribute("value");
    let answerC_correct = document.getElementById("answer3").getAttribute("value");
    let answerD_correct = document.getElementById("answer4").getAttribute("value");
    let answerE_correct = document.getElementById("answer5").getAttribute("value");

    // Create the answer array which stores the answers
    let answers_list = [];
    if(currentOption == "multipleChoice") {
        answers_list = 
        [
            {"answerChoice":"A", "text":answerA, "correct":answerA_correct},
            {"answerChoice":"B", "text":answerB, "correct":answerB_correct},
            {"answerChoice":"C", "text":answerC, "correct":answerC_correct},
            {"answerChoice":"D", "text":answerD, "correct":answerD_correct},
        ];
    }
    else if(currentOption == "multipleAnswers") {
        answers_list = 
        [
            {"answerChoice":"A", "text":answerA, "correct":answerA_correct},
            {"answerChoice":"B", "text":answerB, "correct":answerB_correct},
            {"answerChoice":"C", "text":answerC, "correct":answerC_correct},
            {"answerChoice":"D", "text":answerD, "correct":answerD_correct},
            {"answerChoice":"E", "text":answerE, "correct":answerE_correct}
        ];
    }

    // Create the json object which contains the question, its attributes, and its answers
    let jsonQuestions =
    {
        "date":currentDate,
        "courseID":courseID,
        "question":question,
        "topic":topic,
        "type":type,
        "answers":answers_list
    };

    const jsonString = JSON.stringify(jsonQuestions, null, 2); // Convert JSON object to a formatted string

    // Upload the code onto a server to have the json string processed and stored
    const URL = "https://us-east1-seismic-shape-390607.cloudfunctions.net/json_handling";
    fetch(URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: jsonString,   
    });
}