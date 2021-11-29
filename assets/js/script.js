$(document).ready(function () {

    var apikey = "008f218670e357c6ca33986604e1c5bb";
    //Set the units to Farenheit
    var units = "imperial"; 
  
    //JQuery Event click Search Button
    $("#searchBtn").on("click", function () {
      var cityValue = $("#search").val();
      $("#search").val("");
      weatherForcast(cityValue);
    });
  
    // Set JQuery 
    $("#history-list").on("click", "li", function () {
      var historyValue = $(this).text();
      weatherForcast(historyValue);
    });
  
    // Define function to create row with previous cities
    function createRow(city) {
      var historyListItem = $("#history-list");
      var li = $("<li>")
        .addClass("list-group-item list-group-item-action")
        .text(city);
      historyListItem.prepend(li);
    }
  
    function weatherForcast(cityValue) {
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityValue +
        "&units=" +
        units +
        "&appid=" +
        apikey;
  
      $.ajax({
        url: queryURL,
        type: "GET",
        dataType: "json",
      }).then(function (response) {
        if (history.indexOf(cityValue) === -1) {
          history.push(cityValue);
          window.localStorage.setItem("history", JSON.stringify(history));
          createRow(cityValue);
        }
  
        $("#today").empty();
  
        // create html content for weather now
        var title = $("<h3>")
          .addClass("card-title")
          .text(response.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>")
          .addClass("card-text")
          .text("Wind Speed: " + response.wind.speed + " MPH");
        var humid = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + response.main.humidity + "%");
        var temp = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + response.main.temp + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
        );
  