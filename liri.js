//variables for app functionality
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var axios = require("axios");
var request = require("request");


var liriRequest = process.argv[2]
var userInput = process.argv.slice(3).join(" ");
var omdbKey = "d6b764ec";


//*** Liri.js can take in the following commands:

//switches for liriRequest
switch(liriRequest) {
    case "movie-this":
        movieRequest();
        break;
    case "spotify-this-song":
        spotifyRequest();
        break;
    case "concert-this":
        concertRequest();
        break;
     case "do-what-it-says":
         doWhatItSays();
         break;
 
// instructions
    default: console.log("********************" + "\nINSTRUCTIONS FOR USE" + "\n********************" + "\nType 'node liri' followed by any of these commands to start the application: " + "\n" +
        "movie-this" + " {Enter Movie Name}" + "\n" +
        "spotify-this-song" + " {Enter Artist Name}" + '\n' +
        "concert-this" + " {Enter Name of Band}" + "\n" +
        "do-what-it-says" + " {Leave This Blank}" + "\n"
        );
        break;
 }    
 
//   * `movie-this` --- `node liri.js movie-this '<movie name here>'`
//    * This will output the following information to your terminal/bash window:
//      ```
//        * Title of the movie.
//        * Year the movie came out.
//        * IMDB Rating of the movie.
//        * Rotten Tomatoes Rating of the movie.
//        * Country where the movie was produced.
//        * Language of the movie.
//        * Plot of the movie.
//        * Actors in the movie.
//      ```
//    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
//      * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>
//      * It's on Netflix!
//    * You'll use the `axios` package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.




function movieRequest() {
    if (!userInput) {
        userInput = "high fidelity";
    }
   // user input is worked in to the axios api call
   var movieURL = ("http://www.omdbapi.com/?apikey=" + omdbKey + "&t=" + userInput);
    
    axios.get(movieURL)
         .then(function(response) {
            console.log("\n");
            console.log("********** SEARCHING FOR " + userInput + " **********");
            console.log("\n");
            // limit search to 3 movies in case of overlap
                var results = 
                "********************" +
                "\n" +
                "\n - Title: " + response.data.Title +
                "\n - Year Released: " + response.data.Year +
                "\n - IMDB Rating: " + response.data.imdbRating +
                "\n - Rotten Tomatoes Score: " + response.data.Ratings[1].Value +
                "\n - Country of Origin: " + response.data.Country +
                "\n - Language: " + response.data.Language +
                "\n - Plot: " + response.data.Plot +
                "\n - Cast Members: " + response.data.Actors + 
                "\n" + 
                "\n**********************" +
                "\n";
                console.log(results);
        });
}

//   * `spotify-this-song` --- `node liri.js spotify-this-song '<song name here>'`
//   This will show the following information about the song in your terminal/bash window
//      * Artist(s)
//      * The song's name
//      * A preview link of the song from Spotify
// //      * The album that the song is from
//    * If no song is provided then your program will default to "The Sign" by Ace of Base.
//    * You will utilize the [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.
//    * The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a **client id** and **client secret**:
//    * Step One: Visit <https://developer.spotify.com/my-applications/#!/>
//    * Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.
//    * Step Three: Once logged in, navigate to <https://developer.spotify.com/my-applications/#!/applications/create> to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.
//    * Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the [node-spotify-api package](https://www.npmjs.com/package/node-spotify-api).
 
function spotifyRequest() {
    if (!userInput) {
        userInput = "paul simon";
    }
    spotify
        .search({type: "track", query: userInput})
            .then(function(response) {
                console.log("  ");
                console.log("********** SEARCHING FOR " + userInput + " *********" );
                console.log("  ");
                // limit search results to 3 songs
                for (var i = 0; i < 3; i++) {
                    var results = 
                    "********************" +
                    "\nArtists: " + response.tracks.items[i].artists[0].name +
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nLink To Preview: " + response.tracks.items[i].preview_url;

                    console.log(results);
                }
            })
};
 
//   * `concert-this` --- `node liri.js concert-this <artist/band name here>`
//   This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:
//      * Name of the venue
//      * Venue location
//      * Date of the Event (use moment to format this as "MM/DD/YYYY")

 function concertRequest() {
     var concertURL = ("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp");
     //add logic to come up with error statement if no concerts are availeable.
     console.log("******** " + "You are searching for: " + userInput +  " ********")
     //axios get call
     axios.get(concertURL)
         .then(function(response) {
             var concertData = response.data;
             // var convertedDate = moment("MM/DD/YYYY");
             console.log("This concert is being held at: " + concertData[0].venue.name);
             console.log("The venue is located in: " + (concertData[0].venue.city) + ", " +  concertData[0].venue.region);
             console.log("This event is happening on " + concertData[0].datetime);
         });
 };

 //   * `do-what-it-says` --- `node liri.js do-what-it-says`
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
//      * Edit the text in random.txt to test out the feature for movie-this and concert-this.

  function doWhatItSays() {
     fs.readFile("random.txt", "utf8", function(error, data){
         if (error) {
             return console.log(error);
         } else {
             //split read me file in to an array
             var dataArr = data.split(",");
             // console.log(dataArr);
             // if first index of array is spotify command
             if (dataArr[0] === "spotify-this-song") {
                 // assign second index to userInput
                 userInput = dataArr[1];
                 //then run spotify function
                 spotifyRequest();
              };
         };
         
     });
  };
