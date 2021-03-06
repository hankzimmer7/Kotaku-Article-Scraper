// Grab the scraped articles as json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Only show the articles that haven't been saved
    if (!data[i].saved) {

      //Creat the articles elements
      var articleElement = $("<div>");
      articleElement.addClass("card");
      articleElement.attr("data-id", data[i]._id);

      var cardHeader = $("<div>");
      cardHeader.addClass("card-header");

      var headerRow = $("<div>");
      headerRow.addClass("row");

      const headingColumn = $("<div>")
      headingColumn.addClass("col-md-9");

      var heading = $("<h2>");
      heading.addClass("article-title");

      var link = $("<a>");
      link.addClass("article-link");
      link.attr("target", "_blank");
      link.attr("href", data[i].link);
      link.text(data[i].title);

      heading.append(link);
      headingColumn.append(heading);

      const buttonColumn = $("<div>");
      buttonColumn.addClass("col-md-3");

      var button = $("<button>");
      button.addClass("btn btn-success save-button card-button");
      button.attr("data-id", data[i]._id);
      button.text("Save Article");

      buttonColumn.append(button);
      headerRow.append(headingColumn);
      headerRow.append(buttonColumn);
      cardHeader.append(headerRow);

      var image = $("<img>");
      image.attr("src", data[i].image);
      image.addClass("card-img-bottom");

      articleElement.append(cardHeader);
      articleElement.append(image);

      // Append the article to the page
      $("#articles").append(articleElement);
    };
  }
});

//Function for appending the saved articles to the page
function appendSavedArticles() {

  // Grab the saved articles as json
  $.getJSON("/articles", function (data) {

    $("#articles").empty();

    // For each one
    for (var i = 0; i < data.length; i++) {

      // Only show the articles that have been saved
      if (data[i].saved) {

        //Creat the articles elements
        var articleElement = $("<div>");
        articleElement.addClass("card");
        articleElement.attr("data-id", data[i]._id);

        var cardHeader = $("<div>");
        cardHeader.addClass("card-header");

        var headerRow = $("<div>");
        headerRow.addClass("row");

        const headingColumn = $("<div>")
        headingColumn.addClass("col-lg-9");

        var heading = $("<h2>");
        heading.addClass("article-title");

        var link = $("<a>");
        link.addClass("article-link");
        link.attr("target", "_blank");
        link.attr("href", data[i].link);
        link.text(data[i].title);

        heading.append(link);
        headingColumn.append(heading);

        const buttonColumn = $("<div>");
        buttonColumn.addClass("col-lg-3");

        var noteButton = $("<button>");
        noteButton.addClass("btn btn-primary notes-button card-button");
        noteButton.attr("data-id", data[i]._id);
        noteButton.text("Notes");

        var unsaveButton = $("<button>");
        unsaveButton.addClass("btn btn-danger unsave-button card-button");
        unsaveButton.attr("data-id", data[i]._id);
        unsaveButton.text("Unsave");

        buttonColumn.append(noteButton);
        buttonColumn.append(unsaveButton);
        headerRow.append(headingColumn);
        headerRow.append(buttonColumn);
        cardHeader.append(headerRow);

        var image = $("<img>");
        image.attr("src", data[i].image);
        image.addClass("card-img-bottom");

        //Append the pieces together to create the article element
        articleElement.append(cardHeader);
        articleElement.append(image);

        // Append the article to the page
        $("#articles").append(articleElement);
      };
    };
  });
};

//Function for displaying the notes modal populated with the current article's notes
function displayNotes(selectedArticleId) {

  const modal = document.getElementById("notes-modal");
  $("#notes").empty();
  modal.style.display = "block";
  
  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + selectedArticleId + "/notes"
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log("This log is immediately after the ajax call for the article to get the notes");
      console.log(data);

      const notesHeading = $("<h3>");
      notesHeading.text("Notes for " + data.title);

      $("#notes").append(notesHeading);

      const noteList = $("<ul>");
      noteList.addClass("list-group");

      for (let i = 0; i< data.notes.length; i++) {

        const noteElement = $("<li>");
        noteElement.addClass("list-group-item");
        noteElement.text(data.notes[i].bodyText);

        const deleteNoteButton = $("<span>");
        deleteNoteButton.addClass("btn btn-danger delete-note-button");
        deleteNoteButton.attr("note-data-id", data.notes[i]._id);
        deleteNoteButton.attr("article-data-id", selectedArticleId);
        deleteNoteButton.text("Delete Note");

        // noteList.append(noteElement); 
        noteElement.append(deleteNoteButton);       
        noteList.append(noteElement);
      };

      $("#notes").append(noteList);

      // An input to enter a new note

      const form = $("<form>");

      const formGroup = $("<div>");
      formGroup.addClass("form-group");

      const input = $("<input>");
      input.addClass("form-control");
      input.attr("id", "text-input");
      input.attr("placeholder", "Type a new note here");

      const button = $("<button>");
      button.addClass("btn btn-primary");
      button.attr("id", "savenote");
      button.attr("data-id", data._id);
      button.attr("type", "submit");
      button.text("Save Note");

      formGroup.append(input);
      form.append(formGroup);
      form.append(button);
      $("#notes").append(form);
    });
};

//When the user clicks on the "Scrape New Articles" button
$(document).on("click", "#scrape-button", function () {
  $.ajax({
      method: "GET",
      url: "/scrape"
    })
    .then(function (data) {
      location.reload();
      console.log(data);
    })
});

//When the user clicks on the "Clear Scraped Articles" button, remove the unsaved articles from the database
$(document).on("click", "#clear-button", function () {
  // Run a DELETE request to delete the unsaved articles
  $.ajax({
      method: "DELETE",
      url: "/articles",
      data: {}
    })
    // Once the delete request is complere
    .then(function (response) {
      //Reload the page
      location.reload();
      console.log(response);
    });
});

//When the user clicks on the "Save Button" for an article, save the article
$(document).on("click", ".save-button", function () {
  console.log("clicked save for article " + $(this).attr("data-id"));

  // Grab the id associated with the article from the save button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        saved: true
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      location.reload(true);
    });
});

//When the user clicks on the "Unsave Button" for an article, unsave the article
$(document).on("click", ".unsave-button", function () {
  console.log("clicked unsave for article " + $(this).attr("data-id"));

  // Grab the id associated with the article from the save button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        saved: false
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // location.reload(true);
      appendSavedArticles();
    });
});

//When the user clicks on "Saved Articles", show the saved articles
$(document).on("click", "#saved-articles", function () {
  appendSavedArticles();
});

//When the user clicks the notes button, display the notes modal
$(document).on("click", ".notes-button", function () {
  const selectedArticleId = $(this).attr("data-id");
  displayNotes(selectedArticleId);
});

// When the user clicks on <span> (x), close the notes modal
$(document).on("click", "#close-notes-button", function () {
  const modal = document.getElementById("notes-modal");
  modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  const modal = document.getElementById("notes-modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// When the users clicks the Save note button
$(document).on("click", "#savenote", function (event) {

  event.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId + "/notes",
      data: {
        // Value taken from text input
        bodyText: $("#text-input").val(),
      }
    })
    // With that done
    .then(function (data) {
      //Show all of the notes including the newly created note
      displayNotes(thisId);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#text-input").val("");
});

//When the user clicks the "Delete Note" button
$(document).on("click", ".delete-note-button", function () {


  // Grab the id associated with the note from the button
  const thisNoteId = $(this).attr("note-data-id");
  const selectedArticleId = $(this).attr("article-data-id");

  console.log("deleting note " + thisNoteId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "Delete",
      url: `/articles/${selectedArticleId}/notes/${thisNoteId}`,
    })
    // With that done
    .then(function (data) {
      //Redisplay the notes
      displayNotes(selectedArticleId);
    });
});