var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var request = require("request");


// Require all models
var db = require("./models");

var PORT = process.env.PORT || 1337;

// Initialize Express
var app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: true
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/kotakuArticles");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/kotakuArticles";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping the kotaku website
app.get("/scrape", function (req, res) {

  // Make a request for the Kotaku homepage. The page's HTML is passed as the callback's third argument
  request("https://kotaku.com/", function (error, response, html) {

    // Load the HTML into cheerio and save it to as variable $
    var $ = cheerio.load(html);

    // With cheerio, find each div tag with the "post-wrapper" class
    $("div.post-wrapper").each(function (i, element) {

      // Save an empty result object
      var result = {};

      //This if statement ensures that only articles will be scraped and not ads, as ads don't follow the same structure
      if ($(element).find("h1").find("a").text()) {

        // Save the text of the element in a "title" variable
        var title = $(element).find("h1").children().text();

        // Save the link in a "link" variable
        var link = $(element).find("h1").children().attr("href");

        // Save the image url as an "image" variable
        var image = $(element).find("picture").children().attr("data-srcset");

        // Save these results in an object that we'll push into the results array we defined earlier
        result.title = title;
        result.link = link;
        result.image = image;
        result.saved = false;

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      };
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbUser) {
      // If all Users are successfully found, send them back to the client
      res.json(dbUser);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

//Route for saving an article
app.post("/articles/:id", function (req, res) {

  db.Article.update({
      _id: req.params.id
    }, {
      $set: {
        saved: true
      }
    }, (function (dbArticle) {
      // If the Article was updated successfully, send it back to the client
      // res.json(dbArticle);
    })
  );
});

// Route for grabbing a specific Article by id, populate it with its note
app.get("/articles/:id/notes", function (req, res) {

  db.Article.findOne({
      _id: req.params.id
    })
    // Specify that we want to populate the retrieved articles with any associated notes
    .populate("note")
    .then(function (dbArticle) {
      // If any Libraries are found, send them to the client with any associated Books
      res.send(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id/notes", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  // Create a new Note in the db
  db.Note.create(req.body)
    .then(function (dbNote) {

      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      // If the Article was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port http://localhost:" + PORT);
});