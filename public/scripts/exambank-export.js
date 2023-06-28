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
    if(optionsList.value != "-- Select a Question To Export --") {
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

function exportQuestion(databaseQuestionList) {
    let currentQuestion = document.getElementById("chosenQuestionText").innerHTML;

    for(let i = 0; i < databaseQuestionList.length; i++) {
        if(currentQuestion == databaseQuestionList[i]['question']) {
            let jsonObject = databaseQuestionList[i];
            // let csvObject = convertToCSV(jsonObject);
            // console.log(csvObject);
            let jsonString = JSON.stringify(jsonObject);
            console.log(jsonString);

            // Create a Blob object from the JSON string
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Create a temporary anchor element
            const anchorElement = document.createElement('a');

            // Set the download attribute and the file name
            anchorElement.setAttribute('href', window.URL.createObjectURL(blob));
            anchorElement.setAttribute('download', 'question.json');

            // Programmatically click the anchor element to trigger the download
            anchorElement.click();

            // Clean up the temporary anchor element
            anchorElement.remove();
            window.location.href = "exambank-home.html";
        }
    }
}

var optionsList = document.getElementsByClassName("selectQuestion")[0];

// Displays questions on the exam bank
readJson().then(function(data) {
    // NOTE TO SELF: data == questionArray
    populateOptions(data);
    optionsList.onchange = function() {populateQuestionBody(data)};
})

function execute() {
    readJson().then(function(data) {
        exportQuestion(data);
    })
}