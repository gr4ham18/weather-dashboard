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
  
        // add to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
  
        // call other api
        getForecast(cityValue);
        getUVIndex(response.coord.lat, response.coord.lon);
      });
    }
  
    // 5 day forcast
    function getForecast(cityValue) {
      var queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
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
        $("#forecast")
          .html('<h4 class="mt-3">5-Day Forecast:</h4>')
          .append('<div class="row">');
  
        // loop over all forecasts
        for (var i = 0; i < response.list.length; i++) {
          if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");
  
            tempDate = new Date(
              response.list[i].dt_txt.replace(/-/g, "/")
            ).toLocaleDateString();
  
            var title = $("<h5>").addClass("card-title").text(tempDate);
  
            var img = $("<img>").attr(
              "src",
              "https://openweathermap.org/img/w/" +
                response.list[i].weather[0].icon +
                ".png"
            );
  
            var p1 = $("<p>")
              .addClass("card-text")
              .text("Temp: " + response.list[i].main.temp_max + " °F");
            var p2 = $("<p>")
              .addClass("card-text")
              .text("Humidity: " + response.list[i].main.humidity + "%");
  
            // merge together and put on page
            col.append(card.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      });
    }
  //lat and long for more acurate location
  function getUVIndex(latitude, longitude) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      apikey +
      "&lat=" +
      latitude +
      "&lon=" +
      longitude;

    $.ajax({
      url: queryURL,
      type: "GET",
      dataType: "json",
    }).then(function (response) {
      var uv = $("<p>").text("UV Index: ");
      var btn = $("<span>").addClass("btn btn-sm").text(response.value);
      if (response.value < 3) {
        btn.addClass("btn-success");
      } else if (response.value < 7) {
        btn.addClass("btn-warning");
      } else {
        btn.addClass("btn-danger");
      }
      $("#today .card-body").append(uv.append(btn));
    });
  }