  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDzlvdlcHXZhLSyFZKOI4zui7eIMiLNUz4",
    authDomain: "train-ee946.firebaseapp.com",
    databaseURL: "https://train-ee946.firebaseio.com",
    projectId: "train-ee946",
    storageBucket: "train-ee946.appspot.com",
    messagingSenderId: "908795764440"
  };
  firebase.initializeApp(config);


      


  //create a variable for easy access to firebase
  var database = firebase.database();

  //button for adding trains

  $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

      //get the users input
      var trainName = $("#train-name-input").val().trim();
      var destination = $("#destination-input").val().trim();
      var frequency = $("#frequency-input").val().trim();
      var first = moment($("#first-input").val().trim(), "HH:mm").format("X");

      console.log(first);
      // Create a local object for holding employee data
      var newTrain = {
          train: trainName,
          dest: destination,
          freq: frequency,
          firstTrain : first,
      };

      //push the above data into the firebase
      database.ref().push(newTrain);

      //clear all of the text boxes agian
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#frequency-input").val("");
      $("#first-input").val("");

  });

  database.ref().on("child_added", function(childSnapshot){
      console.log(childSnapshot.val());

      //store everything in a temp variable
      var trainName = childSnapshot.val().train;
      var trainDest = childSnapshot.val().dest;
      var TrainFreq = childSnapshot.val().freq;
      var trainFirst = childSnapshot.val().firstTrain;
      
      //calulate the mintues till the next train arrives and when its next arrival is
    
      //first take the starting time and subtract it from the now time
      var firstTime = moment(trainFirst, "HH:mm").subtract(1, "years");
      console.log(firstTime);
      
      //find the difference in the two
      var difference = moment().diff(moment(firstTime), "minutes");
      console.log(difference);
      
      //find the remainder
      var remainder = difference % TrainFreq;
      console.log(remainder);
      
      //minutes until the next train
      var MinutesTill = TrainFreq - remainder;
      console.log(MinutesTill);
      
      //The time the next train will arrive
      var nextTrain = moment().add(MinutesTill, "minutes");
      

    
    
    

      //create a new row for every entry added by the user
      var row = $("<tr>").append(
          $("<td>").text(trainName),
          $("<td>").text(trainDest),
          $("<td>").text(TrainFreq),
          $("<td>").text(moment(nextTrain).format("hh:mm a")),
          $("<td>").text(MinutesTill + " minutes"),
      );

      $("#Train-table > tbody").append(row);
  })