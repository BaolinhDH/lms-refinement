// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

// Retrieve the exam name
var storedExamName = localStorage.getItem("exam_name");

let maxScore = 0;
let currentScore = 0;

var database = firebase.database();

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
}

function tickHandler(checkbox, groupName) {
    // Get the parent answerList element
    var answerList = checkbox.closest('.answerList');

    // Get all the checkboxes within the same answerList
    var checkboxes = answerList.querySelectorAll('input[type="checkbox"]');

    // Count the number of checked checkboxes within the same answerList
    var checkedCount = 0;
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkedCount++;
        }
    }

    // Get the corresponding question element
    var question = answerList.closest('.question');

    // Check if the answer5 element is hidden
    var answer5 = question.querySelector('.answer[name="answer5"]');
    var isAnswer5Hidden = answer5.style.display === 'none';

    // Determine the maximum number of allowed checkboxes based on the visibility of answer5
    var maxAllowed = isAnswer5Hidden ? 1 : 2;

    // If the number of checked checkboxes exceeds the maximum allowed, uncheck the current checkbox
    if (checkedCount > maxAllowed) {
        checkbox.checked = false;
    }
}
  


// Read the json file
function readJson() {
    return new Promise(function(resolve, reject) {
        database.ref("exam").once("value")
            .then(function(snapshot) {
                let examList = []
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    examList.push(childData);
                });
                resolve(examList);
            })
            .catch(function(error) {
                console.error("Error retrieving data:", error);
                reject(error);
            });
    });
}

// Populate the exam
function populateExam(exam) {
    if(exam['courseID'] == courseID) {
        let questionContainer = document.getElementsByClassName("questionContainer")[0];
        let questions = questionContainer.getElementsByClassName("question");
        let databaseQuestions = exam['questions'];

        for(let i = 0; i < questions.length; i++) {
            // Access question
            let databaseQuestion = databaseQuestions[i];

            if(databaseQuestion == null) { break; }

            let question = questions[i];
            question.style.display = "";

            // Question Text
            let databaseQuestionText = databaseQuestion['question'];
            question.getElementsByClassName("questionText")[0].innerHTML = databaseQuestionText;

            // Answer List
            let answerList = question.getElementsByClassName("answerList")[0];
            let answers = answerList.getElementsByClassName("answer");

            let databaseAnswerList = databaseQuestion['answers'];

            if(databaseAnswerList.length == 5) {
                question.setAttribute("value", "multipleAnswers");
            }
            else if(databaseAnswerList.length == 4) {
                question.setAttribute("value", "multipleChoice");
            }

            for(let j = 0; j < answers.length; j++) {
                let answer = answers[j];
                let databaseAnswer = databaseAnswerList[j];

                if(databaseAnswerList.length == 5) {
                    if(j == 4) {
                        answer.style.display = "";
                    }
                }

                if(databaseAnswer['correct'] == "correct") {
                    answer.setAttribute("value", "correct");
                }

                // Answer text
                let databaseAnswerText = databaseAnswer['text'];
                answer.getElementsByTagName("span")[0].innerHTML = databaseAnswerText;
            }
        }
    }
}

// Retrieve the data from readJson then execute commands
readJson().then(function(data) {
    // Note to self: data = examList
    let examList = data;
    
    for(let i = 0; i < examList.length; i++) {
        let exam = examList[i];
        if(exam['courseID'] == courseID) {
            if(exam['name'] == storedExamName) {
                document.getElementById("examTitle").innerHTML = exam['name'];
                populateExam(exam);
            }
        }
    }
})

function updateGrade(newGrade) {
    // Specify the path to the collection of exams
    const examsPath = '/exam'; // Replace with the actual path in your database

    // Specify the name of the exam you want to update
    const examNameToUpdate = storedExamName; // Replace with the name of the exam you want to update

    // Query the exams collection based on the exam name
    database.ref(examsPath)
        .orderByChild('name')
        .equalTo(examNameToUpdate)
        .once('value')
        .then((snapshot) => {
            // Get the key of the exam to update
            const examKey = Object.keys(snapshot.val())[0]; // Assuming there is only one exam with the specified name

            // Construct the update object with the new value
            const updateObj = { "grade":newGrade };

            // Perform the update operation on the specific exam
            return database.ref(examsPath).child(examKey).update(updateObj);
        })
        .then(() => {
            console.log('Grade updated successfully');
            window.location.href = "assignments-home.html";
        })
        .catch((error) => {
            console.error('Error updating grade:', error);
        });
}

function submitExam() {
    var questionContainer = document.getElementsByClassName('questionContainer')[0];
    var questions = questionContainer.getElementsByClassName('question');
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];

        // Access the answers
        var answerList = question.getElementsByClassName('answerList')[0];
        var answers = answerList.getElementsByClassName('answer');

        if(question.style.display != "none") {
            if(answers[4].style.display == "none") {
                maxScore += 1;
            }
            else{
                maxScore += 2;
            }
        }

        if(answers.length == 5) {
            for (var j = 0; j < answers.length; j++) {
                var answer = answers[j];

                // Access the checkbox value
                var checkbox = answer.getElementsByTagName('input')[0];
                var checkboxValue = checkbox.checked;

                if(checkboxValue == true) {
                    if(answer.getAttribute("value") == "correct") {
                        currentScore++;
                    }
                }
            }
        }
        else if(answers.length == 4) {
            maxScore += 1;
            for (var j = 0; j < (answers.length - 1); j++) {
                var answer = answers[j];

                // Access the checkbox value
                var checkbox = answer.getElementsByTagName('input')[0];
                var checkboxValue = checkbox.checked;

                if(checkboxValue == true) {
                    if(answer.getAttribute("value") == "correct") {
                        currentScore++;
                    }
                }
            }
        }
        
    }
    let examGrade = String(currentScore + "/" + maxScore);
    // console.log(examGrade);
    updateGrade(examGrade);
}