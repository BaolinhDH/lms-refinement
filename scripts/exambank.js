// exambank.js
// Contains script content necessary for the functionality of all exam bank pages + assignment page where completed exams go.
// Remember to port necessary information from files in data folder onto the page using the scripts @Huy @Chi. You can also feel free to split this script up into multiple files if you need

// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

let currentOption = "";

// When the question type is chosen, show answer boxes accordingly
function showAnswers(sel) {
    // When multiple choice (4) is chosen, shows all 5 boxes and hides the 5th one
    if(sel.options[sel.selectedIndex].value == "multipleChoice") {
        currentOption = "multipleChoice";
        displayList();
        document.getElementById("answer5").style.display = "none";
    }
    // When multiple choice (5) is chosen, shows all 5 boxes
    else if(sel.options[sel.selectedIndex].value == "multipleAnswers") {
        currentOption = "multipleAnswers";
        displayList();        
    }
    // Otherwise hide all answer boxes
    else {
        currentOption = "";
        hideList();
    }
}

// Hides all answer boxes
function hideList() {
    document.getElementById("answer1").style.display = "none";
    document.getElementById("answer2").style.display = "none";
    document.getElementById("answer3").style.display = "none";
    document.getElementById("answer4").style.display = "none";
    document.getElementById("answer5").style.display = "none";
}

// Shows all answer boxes
function displayList() {
    document.getElementById("answer1").style.display = "";
    document.getElementById("answer2").style.display = "";
    document.getElementById("answer3").style.display = "";
    document.getElementById("answer4").style.display = "";
    document.getElementById("answer5").style.display = "";
}

function addQuestion() {
    if(document.getElementById("A_correct").checked == true) {
        document.getElementById("answer1").setAttribute("value", "correct")
    }
    else if(document.getElementById("B_correct").checked == true) {
        document.getElementById("answer2").setAttribute("value", "correct")
    }
    else if(document.getElementById("C_correct").checked == true) {
        document.getElementById("answer3").setAttribute("value", "correct")
    }
    else if(document.getElementById("D_correct").checked == true) {
        document.getElementById("answer4").setAttribute("value", "correct")
    }
    else if(document.getElementById("E_correct").checked == true) {
        document.getElementById("answer5").setAttribute("value", "correct")
    }

    let question = document.getElementById("questionInput").value;
    let topic = document.getElementById("topicChoice").value;
    let type = document.getElementById("questionType").value;

    let answerA = document.getElementById("answerA").value;
    let answerB = document.getElementById("answerB").value;
    let answerC = document.getElementById("answerC").value;
    let answerD = document.getElementById("answerD").value;
    let answerE = document.getElementById("answerE").value;

    let answerA_correct = document.getElementById("answer1").getAttribute("value");
    let answerB_correct = document.getElementById("answer2").getAttribute("value");
    let answerC_correct = document.getElementById("answer3").getAttribute("value");
    let answerD_correct = document.getElementById("answer4").getAttribute("value");
    let answerE_correct = document.getElementById("answer5").getAttribute("value");

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

    // const fs = require("fs");
    // const path = require("path");

    // const jsonQuestionsStr = JSON.stringify(jsonQuestions, null, 2);
    // const filePath = path.join(__dirname, "../../database", "question_bank.json");

    // fs.writeFile(filePath, jsonQuestionsStr, 'utf8', (err) => {});

    let jsonQuestions =
    {
        "courseID":courseID,
        "question":question,
        "topic":topic,
        "type":type,
        "answers":answers_list
    };

    alert("enterting json manipulation");

    // let questionsjson = fs.readFileSync("question_bank.json","utf-8");

    // // let questions_parsed = JSON.parse(questionsjson);
    // questionsjson.push(jsonQuestions);
    // // questionsjson = JSON.stringify(questions_parsed);
    // fs.writeFileSync("question_bank.json", questionsjson, "utf-8");

    const fs = require('fs');
    alert("created fs");

    const jsonString = JSON.stringify(jsonQuestions, null, 2); // Convert JSON object to a formatted string

    alert("Created the json string");

    fs.writeFile('output.json', jsonString, 'utf8', (err) => {
    if (err) {
        alert('An error occurred while writing to the file:', err);
        return;
    }
    alert('The JSON object was successfully exported to output.json.');
    });

    alert("it reached the end");
}

// When the question type is chosen, show answer boxes accordingly
document.getElementById("questionType").onchange = function() {showAnswers(this)};
// When "Add Question" is selected, saves all data onto the json file
// and redirects back to the Exam Bank page
document.getElementById("addQuestionBtn").onclick = function() {addQuestion()};