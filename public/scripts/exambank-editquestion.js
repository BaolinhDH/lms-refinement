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

function resetAnswers() {
    var answerList = document.querySelector('.answerList'); // Get the answer_list div

    // Clear checkboxes
    var checkboxes = answerList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
}

function populateOptions(databaseQuestionList) {
    for (let i = 0; i < optionsList.length; i++) {
        // let optionText = options[i].text;
        // Perform desired operations with optionValue and optionText
        if(databaseQuestionList[i] == null) {
            break;
        }
        let databaseQuestion = databaseQuestionList[i];
        let option = optionsList[(i + 1)];
        option.innerHTML = databaseQuestion['question'];
        option.style.display = "";
    }
}

function populateQuestionBody(databaseQuestionList) {
    resetAnswers();
    if(optionsList.value != "-- Select a Question To Edit --") {
        let answer5 = document.getElementsByName("answer5")[0];
        let currentOption = optionsList.value;

        for(let i = 0; i < databaseQuestionList.length; i++) {
            let databaseQuestion = databaseQuestionList[i];

            if(currentOption == databaseQuestion['question']) {
                document.getElementsByClassName("questionText")[0].innerHTML = databaseQuestion['question'];
                document.getElementsByClassName("topicText")[0].innerHTML = databaseQuestion['topic'];
                document.getElementsByClassName("typeText")[0].innerHTML = databaseQuestion['type'];

                document.getElementsByName("answerA")[0].value = databaseQuestion['answers'][0]['text'];
                if(databaseQuestion['answers'][0]['correct'] == "correct") {
                    document.getElementById("checkbox1").checked = true;
                }
                document.getElementsByName("answerB")[0].value = databaseQuestion['answers'][1]['text'];
                if(databaseQuestion['answers'][1]['correct'] == "correct") {
                    document.getElementById("checkbox2").checked = true;
                }
                document.getElementsByName("answerC")[0].value = databaseQuestion['answers'][2]['text'];
                if(databaseQuestion['answers'][2]['correct'] == "correct") {
                    document.getElementById("checkbox3").checked = true;
                }
                document.getElementsByName("answerD")[0].value = databaseQuestion['answers'][3]['text'];
                if(databaseQuestion['answers'][3]['correct'] == "correct") {
                    document.getElementById("checkbox4").checked = true;
                }

                if(databaseQuestion['answers'].length == 5) {
                    document.getElementsByName("answerE")[0].value = databaseQuestion['answers'][4]['text'];
                    if(databaseQuestion['answers'][4]['correct'] == "correct") {
                        document.getElementById("checkbox5").checked = true;
                    }
                    answer5.style.display = "";
                }
                else {
                    answer5.style.display = "none";
                }
            }
        }

        // FINAL STEP: Display the question body
        document.getElementsByClassName("question")[0].style.display = "";
    }
    else {
        document.getElementsByClassName("question")[0].style.display = "none";
    }
}

function tickHandler(checkbox) {
    var checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    let maxLimit;

    if(document.getElementsByName("answer5")[0].style.display == "none") { maxLimit = 1; }
    else { maxLimit = 2; }

    if (checkedCount > maxLimit) {
        checkbox.checked = false; // Disable checkbox selection if the maximum limit is reached
    }

    if(checkbox.checked == false) {
        let parentDiv = checkbox.closest('.answer');
        parentDiv.setAttribute('value', 'incorrect');
    }
}

function createJson(questionText, topicText, typeText) {
    let currentDate = new Date().toJSON().slice(0, 10);

    // Checks if a question is ticked
    // If it is, change said question's div's value to correct
    if(document.getElementById("checkbox1").checked == true) {
        document.getElementsByName("answer1")[0].setAttribute("value", "correct");
    }
    if(document.getElementById("checkbox2").checked == true) {
        document.getElementsByName("answer2")[0].setAttribute("value", "correct");
    }
    if(document.getElementById("checkbox3").checked == true) {
        document.getElementsByName("answer3")[0].setAttribute("value", "correct");
    }
    if(document.getElementById("checkbox4").checked == true) {
        document.getElementsByName("answer4")[0].setAttribute("value", "correct");
    }
    if(document.getElementById("checkbox5").checked == true) {
        document.getElementsByName("answer5")[0].setAttribute("value", "correct");
    }

    // Get all correct values
    let answerA_correct = document.getElementsByName("answer1")[0].getAttribute("value");
    let answerB_correct = document.getElementsByName("answer2")[0].getAttribute("value");
    let answerC_correct = document.getElementsByName("answer3")[0].getAttribute("value");
    let answerD_correct = document.getElementsByName("answer4")[0].getAttribute("value");
    let answerE_correct = document.getElementsByName("answer5")[0].getAttribute("value");

    // Get all answers input
    let answerA = document.getElementsByName("answerA")[0].value;
    let answerB = document.getElementsByName("answerB")[0].value;
    let answerC = document.getElementsByName("answerC")[0].value;
    let answerD = document.getElementsByName("answerD")[0].value;
    let answerE = document.getElementsByName("answerE")[0].value;

    // Create the answer array which stores the answers
    let answers_list = [];
    if(document.getElementsByName("answer5")[0].style.display == "none")
    {
        answers_list =
        [
            {"answerChoice":"A", "text":answerA, "correct":answerA_correct},
            {"answerChoice":"B", "text":answerB, "correct":answerB_correct},
            {"answerChoice":"C", "text":answerC, "correct":answerC_correct},
            {"answerChoice":"D", "text":answerD, "correct":answerD_correct}
        ];
    }
    else
    {
        answers_list =
        [
            {"answerChoice":"A", "text":answerA, "correct":answerA_correct},
            {"answerChoice":"B", "text":answerB, "correct":answerB_correct},
            {"answerChoice":"C", "text":answerC, "correct":answerC_correct},
            {"answerChoice":"D", "text":answerD, "correct":answerD_correct},
            {"answerChoice":"E", "text":answerE, "correct":answerE_correct}
        ];
    }

    let jsonUpdatedQuestion =
    {
        "date":currentDate,
        "courseID":courseID,
        "question":questionText,
        "topic":topicText,
        "type":typeText,
        "answers":answers_list
    }

    return jsonUpdatedQuestion;
}

function sendQuestion(jsonData) {
    // Set the path to push to
    var newDataRef = database.ref("question").push();
    // Push the data to set path
    newDataRef.set(jsonData)
    .then(function() {
        // Confirmation message
        console.log("Data stored successfully!");
        // Redirects to assignment's homepage
        window.location.href = "exambank-home.html";
    })
    // Error handling
    .catch(function(error) {
        console.error("Error storing data:", error);
    });
}

function updateQuestion(updatedQuestion, questionText) {
    // Specify the path to the collection of exams
    const questionPath = '/question'; // Replace with the actual path in your database
    let newQuestionPath;

    database.ref(questionPath)
        .once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                const questions = snapshot.val();
                const questionKeys = Object.keys(questions);
                var questionData = questionKeys.map((key) => questions[key]);
                console.log(questionKeys);
                console.log(questionData);

                console.log(questionData[0]['question']);

                // const keyToUpdate;
                // keyToUpdate = questionKeys.find(key => questionData[key].question === questionNameToUpdate);

                for(let i = 0; i < questionData.length; i++) {
                    if(questionData[i]['question'] == questionText) {
                        var currentQuestionKey = String(questionKeys[i])
                        newQuestionPath = `/question/${currentQuestionKey}`;
                        console.log(newQuestionPath);
                        database.ref(newQuestionPath)
                            .remove()
                            .then(() => {
                                console.log(`Question with key deleted successfully`);
                            })
                            .catch((error) => {
                                console.error(`Error deleting question with key:`, error);
                        });
                        alert("Question edited successfully")
                        sendQuestion(updatedQuestion);
                        break;
                    }
                    else {
                        console.log("No questions found");
                    }
                }
                
            }
        })
        .catch((error) => {
            console.error('Error retrieving questions:', error);
        });    
}

var optionsList = document.getElementsByClassName("selectQuestion")[0];

// Displays questions on the exam bank
readJson().then(function(data) {
    // NOTE TO SELF: data == questionArray
    populateOptions(data);
    optionsList.onchange = function() {populateQuestionBody(data)};
})
let editQuestionBtn = document.getElementById("editQuestionBtn");
// editQuestionBtn.onclick = updateQuestion(createJson(), questionText);

function execute() {
    let confirmationText = "Are you sure you want to edit this question?";
    if(confirm(confirmationText) == true) {
        let questionText = document.getElementsByClassName("questionText")[0].innerHTML;
        let topicText = document.getElementsByClassName("topicText")[0].innerHTML;
        let typeText = document.getElementsByClassName("typeText")[0].innerHTML;

        let jsonObject = createJson(questionText, topicText, typeText);
        console.log(questionText);
        updateQuestion(jsonObject, questionText);
    }
    else {
        alert("Question editing cancelled.")
    }
}