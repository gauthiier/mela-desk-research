if (!window.console) {
  window.console = {
    log: function(msg) {}
  }
}

function init() {
  console.log("Init");  
  $("#map_container").hide();
  $("#survey_container").hide();
	$("#list_container").hide();
  
  $("#map_link").bind("click", function() {
    $("#clusters").hide();
    $("#survey_container").hide();
    $("#map_container").show();
		$("#list_container").hide();
    $("#sideview").show();
  })
  $("#survey_link").bind("click", function() {
    $("#clusters").hide();
    $("#map_container").hide();
    $("#sideview").hide();
		$("#list_container").hide();
    $("#survey_container").show();
  })
  $("#list_link").bind("click", function() {
    $("#clusters").hide();
    $("#map_container").hide();
    $("#sideview").hide();
    $("#survey_container").hide();
		$("#list_container").show();
  })
  
  loadData(dataLoaded_cb, docID_F05);
}


//called when data is finished loading data
function dataLoaded_cb(survey) {
  console.log("Number of loaded cases: " + survey.cases.length);
	//decorate the survey 
	decorate_survey_f05(survey);
	//create list view
	createContentList(survey);  
	//create map view
  var map = new Map();
  map.displayCases(survey.cases);  
  
  //TEMP
  showDetails(survey.cases[0]);
  sideviewEdit();
  
  $("#map_container").show();  
}

$(document).ready(init);
