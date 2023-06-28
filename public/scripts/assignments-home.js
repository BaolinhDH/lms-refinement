// courseID tells you whether the page is for course 1 2 3 or 4
let courseID = document.head.querySelector("meta[content]").getAttribute("content");

var database = firebase.database();

if(window.name == "lecturer") {
    let gradeColumn = document.getElementsByName("student");
    for(let i = 0; i < gradeColumn.length; i++) {
        gradeColumn[i].style.display = "none";
    }
}

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
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

// Populate the exam table
function populateExamTable(examList) {
    let placeholders = document.getElementsByName("examPlaceholder");

    for(let i = 0; i < placeholders.length; i++) {
        if(placeholders[i].getAttribute("value") == "empty") {
            if(examList.length != 0) {
                let exam = examList[0];
                
                if(exam['courseID'] == String(courseID)) {
                    let examNamePlaceholder = placeholders[i].getElementsByClassName("examName")[0];              
                    examNamePlaceholder.getElementsByTagName("span")[0].textContent = exam['name'];
                    
                    placeholders[i].getElementsByClassName("dueDate")[0].textContent = exam['dueDate'];
                    placeholders[i].getElementsByClassName("grade")[0].textContent = exam['grade'];

                    placeholders[i].setAttribute("value", "filled");

                    examList.splice(0, 1);
                }
            }
        }
    }
}

readJson().then(function(data) {
    // Note to self: data = examList
    let temp = data;
    populateExamTable(temp);
})

// Stores a persistent variable to access in other pages
// which in this case will be the exam name.
function storeUniversalVariable(link) {
    if(window.name == "student") {
        localStorage.setItem("exam_name", link.textContent);
        window.location.href = "assignments-takeexam.html";
    }
}
