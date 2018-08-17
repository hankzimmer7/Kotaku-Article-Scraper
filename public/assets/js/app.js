// Grab the scraped articles as json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    console.log("data[i].title " + data[i].title)
    console.log("data[i].saved: " + data[i].saved)
    // Only show the articles that haven't been saved
    if (!data[i].saved) {

      //Creat the articles elements
      var articleElement = $("<div>");
      articleElement.addClass("card");
      articleElement.attr("data-id", data[i]._id);

      var cardHeader = $("<div>");
      cardHeader.addClass("card-header");

      var heading = $("<h3>");

      var link = $("<a>");
      link.addClass("article-link");
      link.attr("target", "_blank");
      link.attr("href", data[i].link);
      link.text(data[i].title);

      var button = $("<button>");
      button.addClass("btn btn-success save-button");
      button.attr("data-id", data[i]._id);
      button.text("Save Article");

      var image = $("<img>");
      image.attr("src", data[i].image);
      image.addClass("img-fluid");

      //Append the pieces together to create the article element
      heading.append(link);
      heading.append(button);
      cardHeader.append(heading);
      articleElement.append(cardHeader);
      articleElement.append(image);

      // Append the article to the page
      $("#articles").append(articleElement);
    };
  }
});

$(document).on("click", "#scrape-button", function () {
  console.log("Clicked the scrape button");

  $.ajax({
      method: "GET",
      url: "/scrape"
    })
    .then(function (data) {
      console.log("Scraped Kotaku for new articles");
      console.log("data: " + data);
      alert("Scraping Kotaku for new articles");
      location.reload();
      alert("Scraped new articles!");

    })

});

$(document).on("click", "#clear-button", function () {
  console.log("Clicked the clear button");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "DELETE",
      url: "/articles"
    })
    // With that done
    .then(function (data) {

      console.log("Cleared the unsaved articles");
      // Log the response
      console.log("data: " + data);
    });
});

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

$(document).on("click", "#saved-articles", function () {

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

        var heading = $("<h3>");

        var link = $("<a>");
        link.addClass("article-link");
        link.attr("target", "_blank");
        link.attr("href", data[i].link);
        link.text(data[i].title);

        var button = $("<button>");
        button.addClass("btn btn-success note-button");
        button.attr("data-id", data[i]._id);
        button.text("Notes");

        var image = $("<img>");
        image.attr("src", data[i].image);
        image.addClass("img-fluid");

        //Append the pieces together to create the article element
        heading.append(link);
        heading.append(button);
        cardHeader.append(heading);
        articleElement.append(cardHeader);
        articleElement.append(image);

        // Append the article to the page
        $("#articles").append(articleElement);
      };
    }
  });
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});