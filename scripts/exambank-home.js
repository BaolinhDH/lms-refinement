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
    let temp = data; // temp array to be modified
    populateQuestionTable(temp); // Displays all questions
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
                
                if(question["courseID"] == String(courseID)) {
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

// Stores the data on Firebase's Realtime Database then redirects back to exambank's homepage
function sendQuestion(jsonData) {
    console.log("Storing data...");
    // Set the path to push to
    var newDataRef = database.ref("question").push();
    // Push the data to set path
    newDataRef.set(jsonData)
    .then(function() {
        // Confirmation message
        console.log("Data stored successfully!");
        // Redirects back to exambank's homepage
        location.reload();
    })
    // Error handling
    .catch(function(error) {
        console.error("Error storing data:", error);
    });
}

function importQuestion() {
    let importBtn = document.getElementById("importBtn");
    importBtn.click();
    importBtn.addEventListener("change", function() {handleFileUpload(event)});
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const jsonContent = e.target.result;
            var jsonData = JSON.parse(jsonContent);

            let currentDate = new Date().toJSON().slice(0, 10);

            jsonData['date'] = currentDate;

            sendQuestion(jsonData);
        };
        reader.readAsText(file);
    }
}

