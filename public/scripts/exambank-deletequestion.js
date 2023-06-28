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

                document.getElementsByName("answerA")[0].innerHTML = databaseQuestion['answers'][0]['text'];
                if(databaseQuestion['answers'][0]['correct'] == "correct") {
                    document.getElementById("checkbox1").checked = true;
                }
                document.getElementsByName("answerB")[0].innerHTML = databaseQuestion['answers'][1]['text'];
                if(databaseQuestion['answers'][1]['correct'] == "correct") {
                    document.getElementById("checkbox2").checked = true;
                }
                document.getElementsByName("answerC")[0].innerHTML = databaseQuestion['answers'][2]['text'];
                if(databaseQuestion['answers'][2]['correct'] == "correct") {
                    document.getElementById("checkbox3").checked = true;
                }
                document.getElementsByName("answerD")[0].innerHTML = databaseQuestion['answers'][3]['text'];
                if(databaseQuestion['answers'][3]['correct'] == "correct") {
                    document.getElementById("checkbox4").checked = true;
                }

                if(databaseQuestion['answers'].length == 5) {
                    document.getElementsByName("answerE")[0].innerHTML = databaseQuestion['answers'][4]['text'];
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
    if(checkbox.checked == true) {
        checkbox.checked = false;
    }
    else if(checkbox.checked == false) {
        checkbox.checked = true;
    }
}

function deleteQuestion() {
    // Specify the path to the collection of exams
    const questionPath = '/question'; // Replace with the actual path in your database
    let newQuestionPath;
    let questionText = document.getElementsByClassName("questionText")[0].innerHTML;

    database.ref(questionPath)
        .once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                const questions = snapshot.val();
                const questionKeys = Object.keys(questions);
                var questionData = questionKeys.map((key) => questions[key]);

                for(let i = 0; i < questionData.length; i++) {
                    if(questionData[i]['question'] == questionText) {
                        var currentQuestionKey = String(questionKeys[i])
                        newQuestionPath = `/question/${currentQuestionKey}`;
                        database.ref(newQuestionPath)
                            .remove()
                            .then(() => {
                                console.log(`Question with key deleted successfully`);
                            })
                            .catch((error) => {
                                console.error(`Error deleting question with key:`, error);
                        });
                        window.location.href = "exambank-home.html";
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

function execute() {
    let confirmationText = "Are you sure you want to delete this question?";
    if(confirm(confirmationText) == true) {
        deleteQuestion();
    }
    else {
        alert("Question deletion cancelled.")
    }
}