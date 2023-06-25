// exambank.js
// Contains script content necessary for the functionality of all exam bank pages + assignment page where completed exams go.
// Remember to port necessary information from files in data folder onto the page using the scripts @Huy @Chi. You can also feel free to split this script up into multiple files if you need

// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

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

    sendQuestion(jsonQuestions);
}

// Stores the data on Firebase's Realtime Database then redirects back to exambank's homepage
function sendQuestion(jsonData) {
    var database = firebase.database();
    console.log("Storing data...");
    // Set the path to push to
    var newDataRef = database.ref("question").push();
    // Push the data to set path
    newDataRef.set(jsonData)
    .then(function() {
        // Confirmation message
        console.log("Data stored successfully!");
        // Redirects back to exambank's homepage
        window.location.href = "exambank_home.html";
    })
    // Error handling
    .catch(function(error) {
        console.error("Error storing data:", error);
    });
}