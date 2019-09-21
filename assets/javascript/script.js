// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB74O4LPjEB3PXYgozNGAEUpMAOmdBvkb8",
    authDomain: "manifest-ivy-149822.firebaseapp.com",
    databaseURL: "https://manifest-ivy-149822.firebaseio.com",
    projectId: "manifest-ivy-149822",
    storageBucket: "manifest-ivy-149822.appspot.com",
    messagingSenderId: "687451388117",
    appId: "1:687451388117:web:f479741018f53d54beca5c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Create a variable to reference the database
var database = firebase.database();

// Check if the military time is entered correctly
function validateHhMm(inputField) {
var isValid = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(inputField.value);

if (isValid) {
    inputField.style.backgroundColor = '#bfa';
    $("#submit").attr("disabled", false);
} else {
    inputField.style.backgroundColor = '#fba';
    $("#alert").text("Please enter the time in military time")
}

return isValid;
}

// Capture Button Click
$("#submit").on("click", function (event) {
    // prevent page from refreshing when form tries to submit itself
    event.preventDefault();

    // Capture user inputs and store them into variables
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    // Code for handling the push
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clear previous input
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
    $("#submit").attr("disabled", true);

});

// Firebase watcher .on("child_added"
database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Console log each of the user inputs to confirm we are receiving them
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.firstTrainTime);
    console.log(sv.frequency);

    // Some Math & Moment.js to determine train arrivals:
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(sv.firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % sv.frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = sv.frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrainLong = moment().add(tMinutesTillTrain, "minutes");
    var nextTrain = moment(nextTrainLong).format("HH:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrainLong).format("HH:mm"));


    // Create new HTML for this new train data
    var newRow = $("<tr>");

    var trainNameTd = $("<td>").text(sv.trainName);
    var destinationTd = $("<td>").text(sv.destination);
    var frequencyTd = $("<td>").text(sv.frequency);
    var nextTrainTd = $("<td>").text(nextTrain);
    var tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain);

    newRow.append(trainNameTd, destinationTd, frequencyTd, nextTrainTd, tMinutesTillTrainTd);

    // Append the table row to the table body
    $("tBody").append(newRow);


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});