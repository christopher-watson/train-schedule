// Initialize Firebase
var config = {
  apiKey: "AIzaSyCxiBZ-Nkh1IEiRBJcFYDhD5vpDXkbSOwY",
  authDomain: "train-schedule-6f7ff.firebaseapp.com",
  databaseURL: "https://train-schedule-6f7ff.firebaseio.com",
  projectId: "train-schedule-6f7ff",
  storageBucket: "train-schedule-6f7ff.appspot.com",
  messagingSenderId: "62559198452"
};
firebase.initializeApp(config);

// Variables
var database = firebase.database();
// var trainName = "";
// var destination = "";
// var trainTime = 0;
// var frequency = "";
var trainName;
var destination;
var trainTime;
var frequency;

var nextTrainTime;
var timeTilNext;
var rowNum = 0;

// On Submit Button Click
$("#add-train-submit-button").on("click", function (event) {
  event.preventDefault();

  // HTML Inputs
  trainName = $("#train-time-input").val().trim();
  destination = $("#train-destination-input").val().trim();
  trainTime = $("#first-train-time-input").val().trim();
  frequency = $("#train-frequency-input").val().trim();

  console.log("Train Info: " + trainName, destination, trainTime, frequency);

  // Push to DB
  database.ref().push({
    name: trainName,
    dest: destination,
    time: trainTime,
    freq: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  // Clear Input Fields
  $("#train-time-input").val('');
  $("#train-destination-input").val('');
  $("#first-train-time-input").val('');
  $("#train-frequency-input").val('');
});

// Get Next Train Time
function findNextTrain(){
  //Train frequency from input
  var trainFrequency = frequency;
  //First train time from input
  var firstTrainTime = trainTime;
  //First train time one year ago
  var newFirstTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log("newFirstTime: " + newFirstTime);
  //Current time
  var currTime = moment();
  console.log("currTime: " + moment(currTime).format("hh:mm"));
  //Time difference between now and the first train a year ago
  var timeDiff = moment().diff(moment(newFirstTime), "minutes");
  console.log("timeDiff: " + timeDiff);
  //Remainder of time left over between one year ago and train frequency
  var timeLeft = timeDiff % trainFrequency;
  console.log("timeLeft: " + timeLeft);
  //Train frequency minus time remainder
  timeTilNext = (trainFrequency - timeLeft);
  console.log("timeTilNext: " + timeTilNext);
  //Next train time
  nextTrainTime = moment().add(timeTilNext, "minutes").format("hh:mm");
  console.log("nextTrainTime: " + nextTrainTime);
}

// Update Table
database.ref().on("child_added", function(snapshot){
  
  var sv = snapshot.val();
  console.log("Database Info {");
  console.log(sv.name);
  console.log(sv.dest);
  console.log(sv.time);
  console.log(sv.freq);
  console.log(sv.dateAdded);
  console.log("} Database Info");
  
  findNextTrain();

  var tNameDisplay = sv.name;
  var destDisplay = sv.dest;
  var freqDisplay = frequency;
  var nextArrDisplay = nextTrainTime;
  var minAwayDisplay = timeTilNext;
  var dateAddedID = sv.dateAdded;

  var tr = $("<tr>");
  tr.attr('id', 'row' + rowNum);
  var td1 = $("<td>").text(tNameDisplay);
  var td2 = $("<td>").text(destDisplay);
  var td3 = $("<td>").text(freqDisplay);
  td3.addClass('text-center');
  var td4 = $("<td>").text(nextArrDisplay);
  td4.addClass('text-center');
  var td5 = $("<td>").text(minAwayDisplay);
  td5.addClass('text-center');
  var td6 = $("<td>");
  td6.addClass('text-center');
  var deleteButton = $("<button>");
  deleteButton.attr('type', 'submit');
  deleteButton.attr('class', 'btn btn-primary button-color delete-train-button');
  deleteButton.html('<i class="fas fa-minus"></i>');
  deleteButton.attr('id', rowNum);
  deleteButton.attr('onClick', '(this.id)');
  deleteButton.attr('date-added', dateAddedID);
  td6.append(deleteButton);
  
  tr.append(td1, td2, td3, td4, td5, td6);
  $("#train-data-area").append(tr);
  rowNum++;

}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

//Delete Row
$(document).on("click", ".delete-train-button", rowDelete);

function rowDelete(clickedId){
  console.log('clicked: ' + clickedId.currentTarget.id);
  console.log('date-added: ' + $(this).attr("date-added"));
  var thisRow = (clickedId.currentTarget.id);
  $('#row'+thisRow).remove();  
  var dateAddedKey = $(this).attr('date-added');
  
  var dateAddedRef = firebase.database().ref("train-schedule/dateAdded");
  var key = dateAddedRef.key; 
  // var key = dateAddedRef.child("train-schedule/dateAdded").key;
  console.log('key: ' + key);

  firebase.database().ref("movies").child(key).remove();


}

