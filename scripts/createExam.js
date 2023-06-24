let courseID = document.head.querySelector("meta[content]").getAttribute("content");

// let jsonData = {"computer":"Mac", "status":"sucks"};

// function displayQuestion() {
//     const URL = "https://us-central1-seismic-shape-390607.cloudfunctions.net/function-1";
//     let jsonData;
//     fetch(URL).then(data => {
//         jsonData = data; // Assign the parsed JSON data to the jsonData variable
//         // You can perform further processing or access jsonData here
//     });
//     document.getElementById("questions_list").innerHTML = JSON.stringify(jsonData);
// }

// window.onload = displayQuestion();

function moreThanMaxQuestionsAllowed() {
    // Declare the current number of question chosen
    let currentQuestionNumber = 0;

    // Get all checkboxes
    var checkboxes = document.getElementsByName("select-checkbox");

    // Go through the list
    for(let i = 0; i < checkboxes.length; i++) {
        // If a checkbox is ticked, update the current number of question chosen
        if(checkboxes[i].checked == true) {
            currentQuestionNumber++;
        }
    }

    // If more than 5 questions are ticked, return true
    if(currentQuestionNumber > 5) {
        return true;
    }
    // If none are ticked or only 1 is ticked, return null
    else if(currentQuestionNumber == 0 || currentQuestionNumber == 1) {
        return null;
    }
    // Otherwise return false
    else {
        return false;
    }
}

function createRequirementCheck(event) {
    var maxQuestionCheck = moreThanMaxQuestionsAllowed();
    // If moreThanMaxQuestionAllowed returns true, sound an alarm due to
    // remind the user to pick less questions
    if(maxQuestionCheck == true) {
        event.preventDefault();
        alert("You cannot have more than 5 questions on an exam.");
    }
    // If moreThanMaxQuestionAllowed returns null, sound an alarm due to
    // remind the user to pick more questions
    else if(maxQuestionCheck == null) {
        event.preventDefault();
        alert("Select multiple questions (5 maximum) to create an exam");
    }
}