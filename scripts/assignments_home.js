// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

var database = firebase.database();

// Read the database and display them on the home page of exam bank
database.ref("exam").once("value")
.then(function(snapshot) {
    examList = []; // Array to store the data
    snapshot.forEach(function(childSnapshot) {
        // Get the data for a question and stores it
        var childData = childSnapshot.val();
        examList.push(childData);
    });
    let temp = examList; // temp array to be modified
    populateExamTable(temp);
})
.catch(function(error) {
    console.error("Error retrieving data:", error);
});

function populateExamTable(examList) {
    let placeholders = document.getElementsByName("examPlaceholder");

    for(let i = 0; i < placeholders.length; i++) {
        if(placeholders[i].getAttribute("value") == "empty") {
            if(examList.length != 0) {
                let exam = examList[0];
                
                let examNamePlaceholder = placeholders[i].getElementsByClassName("examName")[0];              
                examNamePlaceholder.getElementsByTagName("a")[0].textContent = exam['name'];
                
                placeholders[i].getElementsByClassName("dueDate")[0].textContent = exam['dueDate'];
                placeholders[i].getElementsByClassName("grade")[0].textContent = exam['grade'];

                placeholders[i].setAttribute("value", "filled");

                examList.splice(0, 1);
            }
        }
    }
}