const AWS = require('aws-sdk')

const s3 = new AWS.S3();

// We'll call this number
var toNumber = process.env.PHONE_NUMBER;

var https = require('https');
var queryString = require('querystring');

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

// Lambda function:
exports.handler = function (event, context) {
  console.log('Running event');

  // Tells Twilio to make a voice call to the number provided in the event data.
  // End the lambda function when the send function completes.
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  console.log(key);
  const signedUrlExpireSeconds = 60 * 5

  const url_mp3 = s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: event.Records[0].s3.object.key,
      ResponseContentType: 'audio/mp3'
    })
  console.log(url_mp3)

  MakeCall(toNumber,url_mp3, function (status) { context.done(null, status); });


};

// Triggers a voice call using the Twilio API
// to: Phone number to send to
// completedCallback(status) : Callback with status message when the function completes.
function MakeCall(to,url_mp3, completedCallback) {

  // Options and headers for the HTTP request
  var options = {
    host: 'api.twilio.com',
    port: 443,
    path: '/2010-04-01/Accounts/' + process.env.TWILIO_ACCOUNT_SID + '/Calls.json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + new Buffer(process.env.TWILIO_ACCOUNT_SID + ':' + process.env.TWILIO_AUTH_TOKEN).toString('base64')
    }
  };

  // Setup the HTTP request and our response
  var req = https.request(options, function (res) {
    res.setEncoding('utf-8');
    // Collect response data as it comes back.
    var responseString = '';
    res.on('data', function (data) {
      responseString += data;
    });

    // Log the responce received from Twilio.
    // Or could use JSON.parse(responseString) here to get at individual properties.
    res.on('end', function () {
      console.log('Twilio Response: ' + responseString);
      completedCallback('API request sent successfully.');
    });
  });

  // Handler for HTTP request errors.
  req.on('error', function (e) {
    console.error('HTTP error: ' + e.message);
    completedCallback('API request completed with error(s).');
  });

twiml = {
    Twiml:  '<Response>\n' +
              '<Play>\n' + replaceAll(url_mp3,'&','&amp;')+'\n'+
              '</Play>' +
            '</Response>'
};
  url = "http://twimlets.com/echo?" + queryString.stringify(twiml);
  console.log(url);

  // Create the payload we want to send, including the Twiml location, from
  //   which Twilio will fetch instructions when the call connects
  var body = {
    To: to,
    From: process.env.TWILIO_FROM_NUMBER,
    Url: url,
  };
  var bodyString = queryString.stringify(body);

  // Send the HTTP request to the Twilio API.
  // Log the message we are sending to Twilio.
 req.write(bodyString);
  req.end();
}