var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');
var http = require("http");
var fs = require('fs');
var argv = require('optimist')
  .options('track', {
    desc: 'The word to track on the public twitter stream'
  })
  .argv;


var client = redis.createClient();

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
    'statuses/filter',
    { track: [argv.track] },
    function(stream) {
      stream.on('data', function(tweet) {
        console.log(tweet.text);
        client.set(Date.now(), tweet.text);
      });
    }
);
