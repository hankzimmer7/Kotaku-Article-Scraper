var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

//Set port to allow Heroku deployment, or use default port
var PORT = process.env.PORT || 1337;

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/kotakuArticles");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/kotakuArticles";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");
app.use(apiRoutes);
app.use(htmlRoutes);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port http://localhost:" + PORT);
});