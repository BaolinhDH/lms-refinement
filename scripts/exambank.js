// exambank.js
// Contains script content necessary for the functionality of all exam bank pages + assignment page where completed exams go.
// Remember to port necessary information from files in data folder onto the page using the scripts @Huy @Chi. You can also feel free to split this script up into multiple files if you need

let courseID = document.head.querySelector("meta[content]").getAttribute("content"); // CourseID tells you whether the page is for course 1, 2, 3, or 4