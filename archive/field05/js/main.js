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
  
  loadData(dataLoaded_cb, docID_F05);
}


//called when data is finished loading data
function dataLoaded_cb(survey) {
  console.log("Number of loaded cases: " + survey.cases.length);

	decorate_survey_f05(survey);

	//decorate our cases - backward compatible with v0 (marcin)
	// --> clusters
	for(i = 0; i < survey.cases.length; i++) {
		decorate_case(survey.cases[i]);
	}
  
  var map = new Map();
  map.displayCases(survey.cases);  
  $("#map_container").show();  
  
  var clusters = new Clusters(survey.cases);
}

$(document).ready(init);
