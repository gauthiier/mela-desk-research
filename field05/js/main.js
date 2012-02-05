if (!window.console) {
  window.console = {
    log: function(msg) {}
  }
}

function init() {
  console.log("Init");  
  $("#clusters").hide();  
  $("#map_container").hide();
  $("#survey_container").hide();
  
  $("#map_link").bind("click", function() {
    $("#clusters").hide();
    $("#survey_container").hide();
    $("#map_container").show();
    $("#sideview").show();
  })
  
  $("#clusters_link").bind("click", function() {
    $("#map_container").hide();
    $("#survey_container").hide();
    $("#sideview").show();
    $("#clusters").show();  
  })

  $("#survey_link").bind("click", function() {
    $("#clusters").hide();
    $("#map_container").hide();
    $("#sideview").hide();
    $("#survey_container").show();
  })
  
  loadData(dataLoaded_cb, docID);
}


//called when data is finished loading data
function dataLoaded_cb(casesList) {
  console.log("Number of loaded cases: " + casesList.length);
  
  var map = new Map();
  map.displayCases(casesList);  
  $("#map_container").show();  
  
  var clusters = new Clusters(casesList);
}

$(document).ready(init);
