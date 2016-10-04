## Synopsis

A Node application for rendering GDELT event data on a Leaflet map using the Google Big Query API. 

## Installation

Install Node Package Manager (npm) and Node.js (v4 or higher) for your OS.

Run npm install in the root of this project.

Create a Google-APIs project (https://console.developers.google.com)

Get a "Service Account Key" for the Google-APIs project from the Credentials page of the Google API Manager.

On the Service Accounts page, use the Create Key option to download a key file.

Copy the service key file to 'big_query_keyfile.json' in the root of this project.

Update the google-cloud require statement in ./lib/mybq.js with your google-cloud project name.


Launch the server:

node app.js

Launch the browser:

http://localhost:3000

## Usage

Render GDELT events as circles on a Leaflet map.  Color indicates event tone, and diameter indicates average tone magnitude.

Three pre-downloaded data sets are provided, as well as an option to call the Google Big Query API to pull events from any selected day. The Big Query function requires the source code to be updated with google-cloud project information and a service key.

![Application screen shot.](./gevd_screenshot.png?raw=true)