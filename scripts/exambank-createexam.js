// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

var database = firebase.database();

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
}

// Read the database
function readJson() {
    return new Promise(function(resolve, reject) {
        database.ref("question").once("value")
            .then(function(snapshot) {
                let questionArray = []
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    questionArray.push(childData);
                });
                resolve(questionArray);
            })
            .catch(function(error) {
                console.error("Error retrieving data:", error);
                reject(error);
            });
    });
}

// Displays questions on the exam bank
readJson().then(function(data) {
    let temp = data;
    populateQuestionTable(temp);
})

// Takes in an array of questions and display them
function populateQuestionTable(questionList) {
    // Get all elements used to display questions
    let placeholders = document.getElementsByName("questionPlaceholder");
    // Loop through each of them
    for(let i = 0; i < placeholders.length; i++) {
        // Check if its value is empty or not. If it is not empty, move to the next one
        if(placeholders[i].getAttribute("value") == "empty") {
            // If there are questions in the provided array, display it
            if(questionList.length != 0) {
                let question = questionList[0];
                
                if(question['courseID'] == String(courseID)) {
                    if(question['topic'] == "ux") {
                        placeholders[i].getElementsByClassName("topic")[0].innerHTML = "User Experience";
                    }
                    else if(question['topic'] == "aesthetic") {
                        placeholders[i].getElementsByClassName("topic")[0].innerHTML = "Aesthetic";
                    }
    
                    if(question['type'] == "multipleChoice") {
                        placeholders[i].getElementsByClassName("type")[0].innerHTML = "Multiple Choice";
                    }
                    else if(question['type'] == "multipleAnswers") {
                        placeholders[i].getElementsByClassName("type")[0].innerHTML = "Multiple Answers";
                    }
    
                    placeholders[i].getElementsByClassName("date")[0].innerHTML = question['date'];
                    placeholders[i].getElementsByClassName("questionText")[0].innerHTML = question['question'];
    
                    // After displaying, change the attribute of the div to filled
                    placeholders[i].setAttribute("value", "filled");
                    // Lastly, remove that question from the provided array
                    questionList.splice(0, 1);
                }
            }
        }
    }
} // End of populateQuestionTable

// Start of moreThanMaxQuestionsAllowed
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
// End of moreThanMaxQuestionsAllowed

// Start of createRequirementCheck
function createRequirementCheck(event) {
    var maxQuestionCheck = moreThanMaxQuestionsAllowed();
    // If moreThanMaxQuestionAllowed returns true, sound an alarm due to
    // remind the user to pick less questions
    if(maxQuestionCheck == true) {
        event.preventDefault();
        alert("You cannot have more than 5 questions on an exam.");
        return false;
    }
    // If moreThanMaxQuestionAllowed returns null, sound an alarm due to
    // remind the user to pick more questions
    else if(maxQuestionCheck == null) {
        event.preventDefault();
        alert("Select multiple questions (5 maximum) to create an exam");
        return false;
    }
    else {
        return true;
    }
}
// End of createRequirementCheck

// Start of dataHandler
function dataHandler() {
    var table = document.getElementById("bankTable");
    var rows = table.getElementsByTagName("tr");
    var selectedRows = [];

    for(let i = 1; i < rows.length; i++) {
        var checkbox = rows[i].querySelector("input[type='checkbox']");
        if(checkbox.checked == true) {
            var rowData = [];
            var cells = rows[i].getElementsByTagName("td");
            
            for(let j = 0; j < cells.length; j++) {
                rowData.push(cells[j].innerHTML);
            }
            selectedRows.push(rowData);
        }
    }
    return selectedRows;
    // window.location.href = "exambank-createexam.html";
}
// End of dataHandler

function createJson(tickedList, questionList) {
    let questionArray = [];
    let creationDate = new Date().toJSON().slice(0, 10);
    let examName = document.getElementById("examName").value;
    let examDueDate = document.getElementById("examDueDate").value;
    let examDueTime = document.getElementById("examDueTime").value;

    for(let i = 0; i < tickedList.length; i++) {
        for(let j = 0; j < questionList.length; j++) {
            if(String(tickedList[i][2]) == String(questionList[j]['question'])) {
                questionArray.push(questionList[j]);
            }
        }
    }
    let jsonExam =
    {
        "courseID":courseID,
        "date":creationDate,
        "name":examName,
        "dueDate":examDueDate,
        "dueTime":examDueTime,
        "questions":questionArray,
        "grade":"Not Yet Graded"
    };
    return jsonExam
}

// Stores the data on Firebase's Realtime Database then redirects back to exambank's homepage
function sendQuestion(jsonData) {
    // Set the path to push to
    var newDataRef = database.ref("exam").push();
    // Push the data to set path
    newDataRef.set(jsonData)
    .then(function() {
        // Confirmation message
        console.log("Data stored successfully!");
        // Redirects to assignment's homepage
        window.location.href = "assignments-home.html";
    })
    // Error handling
    .catch(function(error) {
        console.error("Error storing data:", error);
    });
}

// function createExam() {
//     readJson().then(function(data) {
//         let rowsTicked = dataHandler();
//         let jsonExam = createJson(rowsTicked, data);
//         sendQuestion(jsonExam);
//         console.log(jsonExam); // The populated questionArray
//     })
// }

function createExam(event) {
    readJson().then(function(data) {
        if(createRequirementCheck(event) == true) {
            let rowsTicked = dataHandler();
            let jsonExam = createJson(rowsTicked, data);
            sendQuestion(jsonExam);
            console.log(jsonExam); // The populated questionArray
            // alert("check completed");
        }
    })
}

let createExamBtn = document.getElementById("createExamBtn");
createExamBtn.onclick = function() {createExam(event)};