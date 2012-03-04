// locale functions

var map = null;

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

  loadSurveys();
}

function buildSurveyMenu(surveyInfo, survey) {
	var field = $("<div/>").attr("class", "field " + surveyInfo.cssClass);
  var title = $("<a/>").attr("class", "ucwpmenu").attr("href", surveyInfo.link).attr("target", "_blank").text(surveyInfo.shortTitle);
  field.append(title);

  var menu = $("<div/>").attr("class", "menu ");
  var casesLink = $("<a/>").attr("class", "list_link").attr("href", "#").text("Cases");
  var addLink = $("<a/>").attr("class", "list_link").attr("href", "#").text("Add");
  menu.append(casesLink);
  menu.append(" | ")
  menu.append(addLink);
  addLink.click(function() {
    sideviewAdd(survey);
    sideviewList(survey);
    map.showMarkerInfo(null, null);
  })
  casesLink.click(function() {
    sideviewList(survey);
    map.showMarkerInfo(null, null);
  });
  field.append(menu);

  $("#fieldList").append(field);
}

function loadSurvey(i) {
  if (i >= melaSurveys.length) return;
  //console.log(i)
  var surveyInfo = melaSurveys[i];

  console.log("Loading", surveyInfo.ssid);
  loadData(surveyInfo.ssid, function(survey) {
    survey.info = surveyInfo;
    console.log("Loaded", surveyInfo.ssid);
    console.log("Number of loaded cases: " + survey.cases.length);

    map.displayCases(survey.cases);

    //TEMP
    //sideviewShowDetails(survey.cases[0]);
    sideviewList(survey, null, true);
    //sideviewEdit();
    //sideviewSendForm();

    buildSurveyMenu(surveyInfo, survey);

    loadSurvey(i + 1);
  });
}

function loadSurveys() {
  map = new Map();

  loadSurvey(0);

  $("#map_container").show();
}


$(document).ready(init);
