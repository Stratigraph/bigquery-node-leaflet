'use strict';

const readline = require('readline');
var fs = require('fs');

// See the Google Cloud developer documentation to set up a project
//  and service key credentials
var bigquery = require('@google-cloud/bigquery')({
  projectId: 'gdeltbrowser',
  keyFilename: './big_query_keyfile.json'
});


function printExample (rows) {
  console.log('Query Results:');
  rows.forEach(function (row) {
    var str = '';
    for (var key in row) {
      if (str) {
        str += '\t';
      }
      str += key + ': ' + row[key];
    }
    console.log(str);
  });
}


module.exports = {

  // This calls the Google Big Query API
  queryGdelt: function (inputs, callback) {

    // See GDELT FractioDate field documentation
    var yearFloat = parseFloat(inputs.year);
    var monthFloat = parseFloat(inputs.month);
    var dayFloat = parseFloat(inputs.day);
    var yearFraction = (monthFloat * 30.0 + dayFloat) / 365.0;
    var fractionStartDate = yearFloat + yearFraction;
    var fractionEndDate = fractionStartDate + 0.003;   // span approx 1 day
    var limit = inputs.limit;

     // Here's the select call. Test it in the Big Query Web UI first: 
     //   https://cloud.google.com/bigquery/bigquery-web-ui
     var query = "SELECT ActionGeo_Lat, ActionGeo_Long, AvgTone FROM  [gdelt-bq:full.events] WHERE FractionDate > " +
                 fractionStartDate + " AND FractionDate < " + fractionEndDate + " AND ActionGeo_Lat is not null " +
                 "LIMIT " + limit + ";";

     console.log("Here's the GDELT SELECT Command: " + query);

     // Set to true to enable the call (false for testing)
     var bqEnabled = true;

     if (bqEnabled) {

       bigquery.query(query, function (err, rows) {

        if (err) {
          return callback(err);
        }

        //printExample(rows);
        callback(null, rows);

      });

     } else {

      callback(null, null); // this will 500 err

     }

   },

   // This loads gdelt data from a file on the server
   queryGdeltMock: function (datafile, callback) {

    var dataPath = "./data/" + datafile;
  
    // read from a file of pre-downloaded data
    var rows = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(dataPath)
    });

    rl.on('line', function (line) {
      var cleanLine = line.replace(/\"/g, '');
      var rowJson = JSON.parse(line);
      rowJson.ActionGeo_Lat = parseFloat(rowJson.ActionGeo_Lat);
      rowJson.ActionGeo_Long = parseFloat(rowJson.ActionGeo_Long);
      rowJson.AvgTone = parseFloat(rowJson.AvgTone);
      rows.push(rowJson);
    });

    rl.on('close', function() {
      callback(null, rows)
    });

   },

   // Turn the API response (or file rows) into JSON
   makeEventsJsonArray: function(dataDescription, rows) {

    var jsonResp = {};
    var eventsJsonArray = [];

    rows.forEach(function(event) {
      var point = {
        lat: event.ActionGeo_Lat,
        long: event.ActionGeo_Long,
        tone: event.AvgTone
      };

      eventsJsonArray.push(point);

    });

    jsonResp.status = "Request for '" +
      dataDescription + "' returned " + rows.length + " events.";
    jsonResp.events = eventsJsonArray;

    return jsonResp;
  } 

}

  