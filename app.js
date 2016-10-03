var express = require("express");
var bodyParser = require("body-parser");
var https = require("https");
var fs = require("fs");
var mybq = require("./lib/mybq");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});

app.use(express.static("./public"));


// Respond by loading and parsing a locally stored file with gdelt data
app.post("/bqgdeltmock", function(req, res) {

  var datafile = req.body.datafile; 
  console.log("Launching MOCK GDELT Query using: " + datafile + "\n");

  mybq.queryGdeltMock(datafile, function(err, rows) {

   console.log("Mock Big Query Status: " + err + "\n");

   rows.forEach(function(row) {
    var str = '';
    for (var key in row) {
     if (str) {
      str += '\t';
    }
    str += key + ': ' + row[key];
  }

})

   var dataDescription = "saved data set for the week of Sept 29th, 2016";
   res.send(mybq.makeEventsJsonArray(dataDescription, rows));
   res.end();

 })
});


// An API call to Google Big Query. Use sparingly, has quotas. 
//  Requires an active google-cloud project with service credentials
app.post("/bqgdelt", function(req, res) {

  console.log("Launching GDELT Query using: " + JSON.stringify(req.body) + " \n");

  mybq.queryGdelt(req.body, function(err,rows){

   console.log("Big Query Status: " + err + "\n");

   var dataDescription = "Big Query for " + req.body.year + "." + 
   req.body.month + "." + req.body.day; 

   res.send(mybq.makeEventsJsonArray(dataDescription, rows));
   res.end();
 })

})


app.listen(3000);

console.log("Express app running on port 3000");

module.exports = app;