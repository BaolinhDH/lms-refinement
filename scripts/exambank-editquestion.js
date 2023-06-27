// Reference code below
// database.ref("data").on("value", function(snapshot) {
//     var data = snapshot.val();
//     console.log(data);  // Print the retrieved data

//     var newData = {
//         age: 35,
//         city: "San Francisco"
//     };
      
//     // Update the data in the database
//     database.ref("data").update(newData);
// });

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

            document.getElementsByClassName("questionText")[0].innerHTML = databaseQuestion['question'];

            if(currentOption == databaseQuestion['question']) {

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

var optionsList = document.getElementsByClassName("selectQuestion")[0];

// Displays questions on the exam bank
readJson().then(function(data) {
    // NOTE TO SELF: data == questionArray
    populateOptions(data);
    optionsList.onchange = function() {populateQuestionBody(data)};
})