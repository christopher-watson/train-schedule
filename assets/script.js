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
var trainName = "";
var destination = "";
var trainTime = 0;
var frequency = "";

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

// Update DB
database.ref().on("child_added", function(snapshot){
  var sv = snapshot.val();


  console.log("Database Info {");
  console.log(sv.name);
  console.log(sv.dest);
  console.log(sv.time);
  console.log(sv.freq);
  console.log(sv.dateAdded);
  console.log("} Database Info {");

  // Update Table
  var nameDisplay = sv.name;
  var destDisplay = sv.dest;
  var freqDisplay = sv.time;
  var nextDisplay = sv.rate;
  var minDisplay = sv.rate;

  //Get num of months since start date
  var totalMonths = moment().diff(moment(startDateDisplay, 'DD/MM/YY'), 'months');
  var totalRate = parseInt(totalMonths * parseInt(monthlyRateDisplay));

  // var $tbody = $("tbody");
  var tr = $("<tr>");
  var tdName = $("<td>").text(nameDisplay);
  var tdRole = $("<td>").text(roleDisplay);
  var tdStart = $("<td class=text-center>").text(startDateDisplay);
  var tdMonthWork = $("<td class=text-center>").text(totalMonths);
  var tdMonthRate = $("<td class=text-center>").text("$" + monthlyRateDisplay);
  var tdTotalBill = $("<td class=text-center>").text("$" + totalRate);
  tr.append(tdName, tdRole, tdStart, tdMonthWork, tdMonthRate, tdTotalBill);
  $("#employee-data").append(tr);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});