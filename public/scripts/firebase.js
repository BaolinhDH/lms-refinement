function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyB6Alp_Nv9OkJ9XeWEM5q_zLepOXGG9P6Y",
        authDomain: "lms-improved-392e7.firebaseapp.com",
        databaseURL: "https://lms-improved-392e7-default-rtdb.firebaseio.com/",
        projectId: "lms-improved-392e7",
        storageBucket: "lms-improved-392e7.appspot.com",
        messagingSenderId: "899731687935",
        appId: "1:899731687935:web:2527f7f9abac8231ddbfca"
    };
    firebase.initializeApp(firebaseConfig);
}

window.onload = initializeFirebase();