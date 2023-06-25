// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

var database = firebase.database();

// Read the database and display them on the home page of exam bank
database.ref("question").once("value")
.then(function(snapshot) {
    questionArray = []; // Array to store the data
    snapshot.forEach(function(childSnapshot) {
        // Get the data for a question and stores it
        var childData = childSnapshot.val();
        questionArray.push(childData);
    });
    let temp = questionArray; // temp array to be modified
    populateQuestionTable(temp); // Displays all questions
})
.catch(function(error) {
    console.error("Error retrieving data:", error);
});

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
} // End of populateQuestionTable
