require("dotenv").config();

var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment");

var arguments = process.argv;

var command = arguments[2].toLowerCase();

var cmdArg = arguments[3];

function spotifyThis(cmdArg) {

  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: 'track', query: cmdArg }, function(err, data) {
    if (err) {
      return logIt('Error occurred: ' + err);
    }
   
  logIt("Artist: " + data.tracks.items[0].artists[0].name);
  logIt("Track Name: " + data.tracks.items[0].name); 
  logIt("Preview URL: " + data.tracks.items[0].preview_url); 
  logIt("Album: " + data.tracks.items[0].album.name);
  });
}

function concertThis(cmdArg) {
  request("https://rest.bandsintown.com/artists/" + cmdArg + "/events?app_id=codingbootcamp", function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

      var JS = JSON.parse(body);
      logIt("Venue: " + JS[0].venue.name);
      logIt("Location: " + JS[0].venue.city + ", " + JS[0].venue.region + ", " + JS[0].venue.country);
      logIt("Date & Time: " + moment(JS[0].datetime).format("MM/DD/YYYY HH:mm"));
    }
  });
}

function movieThis(cmdArg) {
  request("http://www.omdbapi.com/?apikey=trilogy&t=" + cmdArg, function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

      var result = JSON.parse(body);
      logIt("Title: " + result.Title);
      logIt("Released: " + result.Year);
      logIt("IMDB Rating: " + result.Ratings[0].Value);
      logIt("Rotten Tomatoes Rating: " + result.Ratings[1].Value);
      logIt("Country: " + result.Country);
      logIt("Language: " + result.Language);
      logIt("Plot: " + result.Plot);
      logIt("Actors: " + result.Actors);
    }
  });
}

function testCommands() {
  if (command === "spotify-this-song") {
    if (cmdArg) {
      logIt("Command: " + command + ", Argument: " + cmdArg);
      spotifyThis(cmdArg);
    } else {
      cmdArg = "The Sign Ace Of Base";
      logIt("Command: " + command + ", Argument: " + cmdArg);
      spotifyThis(cmdArg);
    };
  } else if (command === "concert-this") {
    if (cmdArg) {
      logIt("Command: " + command + ", Argument: " + cmdArg);
      concertThis(cmdArg);
    } else {
      logIt("Command: " + command);
      return logIt("Please provide a band name");
    };
  } else if (command === "movie-this") {
    if (cmdArg) {
      logIt("Command: " + command + ", Argument: " + cmdArg);
      movieThis(cmdArg);
    } else {
      logIt("Command: " + command);
      return logIt("Please provide a movie name");
    };
  } else if (command === "do-what-it-says") {
    logIt("Command: " + command);
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return logIt(error);
      }  
      var dataArr = data.split(",");  
      command = dataArr[0];
      cmdArg = dataArr[1];
      testCommands();  
    });
  } else {
    logIt("Command: " + command);
    logIt("Please enter a valid command (ie. spotify-this-song, concert-this, movie-this, do-what-it-says");
  };
}

testCommands();

function logIt(dataToLog) {

	console.log(dataToLog);

	fs.appendFile('log.txt', dataToLog + '\n', function(err) {
		
		if (err) return logIt('Error logging data to file: ' + err);	
	});
}
