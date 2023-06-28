// login.js
// Logic for logging in from index.html and site-wide conditional teacher/student changes

// Universal variable to identify who's currently logged in
window.name = "";

document.querySelector('#loginStudent').addEventListener('click', function() {
    window.name = "student";
    window.location.href = 'dashboard.html';
});

document.querySelector('#loginLecturer').addEventListener('click', function() {
    window.name = "lecturer";
    window.location.href = 'dashboard.html';
});