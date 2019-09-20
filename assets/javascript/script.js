// Initial array of topics
var topics = [
    "Tina Fey",
    "Amy Poehler",
    "Kristen Wiig",
    "Kate McKinnon",
    "Aubrey Plaza",
    "Maya Rudolph",
    "Ellie Kemper",
    "Mindy Kaling",
    "Emma Stone",
    "Lisa Kudrow",
    "Catherine O'Hara"
];

// Variables related to the GiphY API

var APIkey = "q9CGcggx5BEpVZZ63u4a2I817X5LVIvy";
var sampleURL = "http://api.giphy.com/v1/gifs/search?q=SNL&api_key=q9CGcggx5BEpVZZ63u4a2I817X5LVIvy&limit=5";


// Function for displaying the gifs
function displayGifs() {

    var category = $(this).attr("data-name");

    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + category + "&api_key=" + APIkey + "&limit=10";


    // Creating an AJAX call for the specific category button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);

        $("#gifs-view").empty();

        for (var i = 0; i < response.data.length; i++) {

            // Check to see that the correct data is being pulled
            console.log(response.data[i].rating);
            console.log(response.data[i].images.original.url);
            console.log(response.data[i].images.original_still.url);

            // Create local variables for that data
            var rating = response.data[i].rating;
            // Fixed height so they fit together nicely
            var stillGif = response.data[i].images.fixed_height_still.url;
            var animatedGif = response.data[i].images.fixed_height.url;

            // Create a well div for the image and the rating
            var wellDiv = $("<div>");
            wellDiv.addClass("card");
            wellDiv.attr("id", "articleDiv-" + i);
            $("#gifs-view").append(wellDiv);

            // Attach the content to the appropriate well
            if (response.data[i].rating != "null") {

                // create a <p> tag for the Rating info
                var pCard = $("<p>");
                pCard.addClass("card-text");
                pCard.text("Rating: " + rating);

                $("#articleDiv-" + i).append(pCard);
            }

            // Create an image tag for each of the gifs with all the different attributes
            var gifImg = $("<img>");
            gifImg.addClass("gif");
            gifImg.addClass("card-img-top");
            gifImg.attr("data-state", "still");
            gifImg.attr("data-still", stillGif);
            gifImg.attr("data-animate", animatedGif);
            gifImg.attr("src", stillGif);

            // Attach the gifs to the divs on the webpage
            $("#articleDiv-" + i).prepend(gifImg);
        }
    });
}

// Function for changing gifs from still to animated
$(document).on("click", ".gif", function () {

    // Local variables that collect the attribute data
    var state = $(this).attr("data-state");
    var animateVal = $(this).attr("data-animate");
    var stillVal = $(this).attr("data-still");

    // Check the variable's data state and then switch it from still to animate and change the src attribute from still to animate
    if (state === "still") {
        $(this).attr({
            src: animateVal,
            "data-state": "animate"
        });
    } else {
        $(this).attr({
            src: stillVal,
            "data-state": "still"
        });
    }
});


// Function for displaying buttons
function renderButtons() {

    // Deleting the category buttons prior to adding new category buttons
    $("#buttons-view").empty();

    // Looping through the array of topics
    for (var i = 0; i < topics.length; i++) {

        // Code that creates the HTML that is added to the webpage
        var newBtn = $("<button>");
        newBtn.addClass("topic-btn btn");
        newBtn.attr("data-name", topics[i]);
        newBtn.text(topics[i]);

        // add that new HTML to the buttons section of the webpage
        $("#buttons-view").append(newBtn);
    }
}

// Function for adding new topic buttons
$("#add-topic").on("click", function (event) {

    // prevent page from reloading
    event.preventDefault();

    // This grabs the new topic
    var newTopic = $("#topic-input").val().trim();
    // then adds the topic to the array
    topics.push(newTopic);

    // this regenerates all the buttons from the array (instead of just adding a new one)
    renderButtons();

    // Clear previous input
    $("#topic-input").val("");
});

// When you click a button, that loads all the gifs from the function above
$(document).on("click", ".topic-btn", displayGifs);

// This function needs to be called when the page loads to load the buttons in the intial array
renderButtons();