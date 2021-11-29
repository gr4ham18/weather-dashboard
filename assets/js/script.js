var apikey = "008f218670e357c6ca33986604e1c5bb";
//Set the units to Farenheit
var units = "imperial"; 

  //JQuery Event click Search Button
  $("#searchBtn").on("click", function () {
    var cityValue = $("#search").val();
    $("#search").val("");
    weatherForcast(cityValue);
  });
