//Create references for libraries
var express = require('express');
var http = require('http');
var firebase = require('firebase');
var twilio = require('twilio');
var dotenv = require('dotenv');

// Express server setup
var app = express();
var server = http.createServer(app);
dotenv.load();

firebase.initializeApp({
  serviceAccount: "firebase-credentials.json",
  databaseURL: "https://mutant-hours-8f7c3.firebaseio.com"
})
var rootRef = firebase.database().ref();

// Authenticate with twilio
//process.env.XXXX will allow access to globals in the .env file
var twilioClient = twilio(process.env.TWILIO_SID,
process.env.TWILIO_AUTH_TOKEN);

// Listen for enw texts being added
var textsRef = rootRef.child('texts');
// .on is a firebase method (look up documentation for mas details)
textsRef.on('child_added', function(snapshot) {
  var text = snapshot.val();
  twilioClient.messages.create({
    body: text.name + ", I am a machine here for " + text.topic + "",
    to: '+12607973961',  // Text this number
    from: process.env.TWILIO_NUMBER // From a valid Twilio number
  }, function(err, message) {
      if (err) {
        console.log(err.message);
      }
  });
});

server.listen(3030, function() {
  console.log('listening on http://localhost:3030');
})
