//liri.js

//fs require
var fs=require("fs");

// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");

//more requires, first twitter api, spotify, omdb
var twitter = require("twitter");
var spotify = require('spotify');
var omdb = require('omdb');

//read the twitter keys from key.js file
var twitter_keys = require("./keys.js");
//var random_text = require("./random.txt")

//guess this is built in
// function Twitter(consumer_key, consumer_secret, access_token_key, access_token_secret) {
//     this.consumer_key = consumer_key;
//     this.consumer_secret = consumer_secret;
//     this.access_token_key = access_token_key;
//     this.access_token_secret = access_token_secret;
// }

//what does the user want?
var command =  process.argv[2];

//requested my-tweets
function my_tweets() {
    var tweet_start = 0;
    var tweet_end = 0;
    var tweet_count = 20;
    console.log("Show at most my last "+ tweet_count +" tweets");

    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key: twitter_keys.twitterkeys.consumer_key,
        consumer_secret: twitter_keys.twitterkeys.consumer_secret,
        access_token_key: twitter_keys.twitterkeys.access_token_key,
        access_token_secret: twitter_keys.twitterkeys.access_token_secret
        });

        var params = {screen_name: 'coding_kd'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            //only want the last tweet_count tweets
            tweet_end = tweets.length;

            if (tweet_end > tweet_count) {
                tweet_start = 0;
                tweet_end=tweet_count;
                console.log("Too many tweets only do most recent "+tweet_end);
            } else {
                console.log("Show all "+tweet_end+" tweets Because that is all there is");
           }

            for ( var i=tweet_start; i < tweet_end; i++) {
                console.log("===========================");
                console.log(tweets[i].created_at);
                console.log(tweets[i].source);
                console.log("...........................");
                console.log(tweets[i].text);
                console.log("...........................");
            }
                console.log("===========================");
        } else {
                console.log("===========================");
                throw error
                console.log("===========================");
        }
    });

}

//requested spotify-this-song
function spotify_this_song() {
    console.log("Here is your spotify song information");

    if (process.argv.length < 4) {
        song='The Sign';
    } else {
        song = process.argv[3];
    }

    console.log("Currently playing " + song);

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
    
    var songInfo = data.tracks.items;
    for (var i=0; i < songInfo.length; i++) {
        if ( i === 0) {
             console.log("===========================");
        }
        if (songInfo[i].name === song) {
            console.log("Artist: "+songInfo[i].artists[0].name);
            console.log("Song Name: "+songInfo[i].name);
            console.log("Link: "+ songInfo[i].preview_url);
            console.log("From Album: "+songInfo[i].album.name);
            console.log("===========================");
            }
        }
    });

}

//requested movie-this
function movie_this() {
    console.log("Here is your movie info");
    
    if (process.argv.length < 4) {
        movie_title='Mr. Nobody';
    } else {
        movie_title = process.argv[3];
    }

    var query = "http://www.omdbapi.com/?apikey=40e9cece&t=$" 
    + movie_title + "&y=&plot=short&tomatoes=true&r=json"
    
    request(query, function(error, response, body){
    if (!error && response.statusCode === 200) {
        console.log("===========================");
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("Rating: " + JSON.parse(body).imdbRating);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actor Roles: " + JSON.parse(body).Actors);
        console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
        console.log("===========================");

        }
    });

}


function do_what_it_says() {
    console.log("Do what you said");

     fs.readFile("random.txt", "utf8", function(error, data) {

         // If the code experiences any errors it will log the error to the console.
         if (error) {
             return console.log(error);
         }

         // Then split it by commas (to make it more readable)
         var sayings = data.split(",");
         command = sayings[0];
         param_3 = sayings[1];
         process.argv[3] = param_3.replace(/"/g,"");
         
console.log(sayings[0]);
console.log(sayings[1]);
console.log(process.argv[3]);

         switch (command) {
             case "my-tweets":
                 my_tweets();
                 break;
             case "spotify-this-song":
                 spotify_this_song();
                 break;
             case "movie-this":
                 movie_this();
                 break;
         }

     });

}

switch(command) {
    case "my-tweets":
        my_tweets();
        break;
    case "spotify-this-song":
        spotify_this_song();
        break;
    case "movie-this":
        movie_this();
        break;
    case "do-what-it-says":
        do_what_it_says();
        break;
    default:
        console.log(command + " is invalid");
}

