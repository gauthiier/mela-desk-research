if (!window.console) {
  window.console = {
    log: function(msg) {}
  }
}

function init() {
  console.log("Init");  
  $("#map_container").hide();
  $("#survey_container").hide();
  
  $("#map_link").bind("click", function() {
    $("#clusters").hide();
    $("#survey_container").hide();
    $("#map_container").show();
    $("#sideview").show();
  })
  $("#survey_link").bind("click", function() {
    $("#clusters").hide();
    $("#map_container").hide();
    $("#sideview").hide();
    $("#survey_container").show();
  })
  
  loadData(dataLoaded_cb, docID);

	console.log("Go!");
}


//called when data is finished loading data
function dataLoaded_cb(survey) {
  console.log("Number of loaded cases: " + survey.cases.length);  
  var map = new Map();
  map.displayCases(survey.cases);  
  $("#map_container").show();  
}

$(document).ready(init);
