const fs = require('fs');
const md5 = require('md5');
const readline = require('readline');
const { google } = require('googleapis');
var app = require("node-server-screenshot");


var pageWidth = 800;
var pageHeight = 600;
        
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'config/token.json';
let spreadsheetId = '';


// Load spreadsheet Id from config file
fs.readFile('config/config.json', (err, content) => {
  if (err) return console.log('Error loading config file:', err);
  const config = JSON.parse(content);
  spreadsheetId = config.spreadsheetId;

  start();
});

function start() {
  // Load client secrets from a local file.
  fs.readFile('config/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors);
  });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
 function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'Unternehmungen!A2:G',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      
      /*
      Datum	Url	Titel	Kategorie	Adresse	Schlagworte	Beschreibung
      0      1      2   3       4       5             6
      [
  '20.11.2018',
   'https://www.kommune21.de/',
  'Titel',
   'Regen',
  'Rekener Straße 234, 45721 Haltern am See',
  'Nachrichten, Open Government',
  'Nachrichtenmagazin für Open Data, Open Government, und Digitalisierung' ]
*/
      rows.map((row) => {
        if (row[4]) {
          const title = row[2];
          const addr = row[4];
          const keywords = row[5].split(", ");
          const date = row[0];
          const url = row[1];
          const categories = row[3].split(", ");
          const desc = row[6];
          const mdfive = md5(row[0]);
          const slug = title.toLowerCase().replace(/[^\w\d]+/g, "-");
          
          const categoryString = categories.join('", "') + '", "' + keywords.join('", "');

          const parts = date.match(/(\d+)/g);
          const jsDate = new Date(parts[2], parts[1]-1, parts[0]);
          const isoDate = jsDate.toISOString();

          const content = `---
title: "${title}"
date: ${isoDate}
publishdate: ${isoDate}
lastmod: ${isoDate}
image: "/images/posts/${slug}.png"
tags: ["${categoryString}"]
type: "post"
comments: false
---
${desc}

## Internetadresse
<a target="_blank" href="${url}">${url}</a>

## Adresse
${addr}
`;

          const filename = slug + ".md"
          
          const outputFile = "../content/posts/" + filename;
          fs.writeFile(outputFile, content, function(err) {
            if(err) {
                return console.log(err);
            }
            const filestats = fs.statSync(outputFile);
            console.log("The file was saved:", outputFile, "size:", filestats.size);
          }); 

             
          const address = url;
          var output = "../static/images/posts/" + slug + ".png";
          
          var fileSizeInBytes = 0;
          if (fs.existsSync(output)) {
              const stats = fs.statSync(output);
              fileSizeInBytes = stats.size; 
          }
          if (fileSizeInBytes > 50) {
              
              // screenshot is alread there
              console.log("skipping", address, output);
          } else {

              // generate screenshot
              loadPage(address, output);        
          } 
          
        }
      });



    } else {
      console.log('No data found.');
    }
  });
}



function loadPage(address, output)
{
    console.log("Processing", address);

        app.fromURL(address, output, {
            width: pageWidth,
            height: pageHeight, 
        }, function(){
            //an image of google.com has been saved at ./test.png
            console.log("wrote " + output);
        });

}
