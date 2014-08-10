var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');
var http = require("http");
var fs = require('fs');


//create redis client                                                                                                                                                                                                                       
var client = redis.createClient(6379, '23.253.61.28', {});

//if the 'awesome' key doesn't exist, create it                                                                                                                                                                                             
client.exists('awesome', function(error, exists) {
    if(error) {
        console.log('ERROR: '+error);
    } else if(!exists) {
        client.set('awesome', 0); //create the awesome key
    };
});

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
    'statuses/filter',
    { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
            //if awesome is in the tweet text, increment the counter                                                                                                                                                                        
            if(tweet.text.match(/awesome/)) {
                client.incr('awesome');
            }
        });
    }
);

fs.readFile('./index.html', function (err, html) {
  if (err) {
    throw err; 
  }
  http.createServer(function (req, res) {
    client.get("awesome", function (error, awesomeCount) {
      if (error !== null) {
        //handle error here
        console.log("error: " + error);
      } else {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end("The awesome count is " + awesomeCount);
      }
    });
  }).listen(3000);
});    

