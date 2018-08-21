var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  //Saved is a property which stores whether or not the user has saved the article
  //Saved articles are able to have notes and are not deleted when the user clears the currently scraped articles
  saved: {
    type:Boolean,
    required:true
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows populating the Article with an associated Note
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
