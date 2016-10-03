## Synopsis

A Node application for rendering GDELT event data on a Leaflet map using the Google Big Query API. 

## Installation

Pre-requisites:

Install npm, node and express.
Install the google-cloud package for node.
Create a google-cloud project and get a service-key for that project.
Copy the service key file to big_query_keyfile.json in the root of this project.
Update the google-cloud require statement in ./lib/mybq.js with your google-cloud project info.

Run npm install.

Launch the server:

nodemon --ignore node_modules app.js

Launch the browser:

http://localhost:3000

## Usage

Render GDELT events as circles on a Leaflet map.  Color indicates event tone, and diameter indicates average tone magnitude.
Three pre-downloaded data sets are provided, as well as an option to call the Google Big Query API to pull events from any selected day. The Big Query function requires the source code to be updated with google-cloud project information and a service key.

