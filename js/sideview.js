var sideviewCurrentCase = null;
var sideviewCurrentSurvey = null;

var nonApplicableFields = ["Identity Construction", "Representation", "Conception of Cultural Representations", "Audience of Cultural Representations", "Multinationalism", "Contemporaneousness" ,"Provocativeness"];


String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

function sideviewInitSearch() {
  var input = $("#cases_list input[type='text']");
  input.bind("keydown", function() {
    var searchPhrase = input.val().toLowerCase();
    if (searchPhrase.length == 0) return;

    var cases = [];
    for(var i=0; i<surveys.length; i++) {
      if (!surveys[i].cases) continue;
      for(var j=0; j<surveys[i].cases.length; j++) {
        var melaCase = surveys[i].cases[j];
        for(var d in melaCase.data) {
          var data = melaCase.data[d];
          if (!data) {
            continue;
          }
          var dataStr = (""+data).toLowerCase();
          if (dataStr.indexOf(searchPhrase) > -1) {
            cases.push(melaCase);
            break;
          }
        }
      }
    }
    sideviewListCases(cases);
  });
}

function sideviewGetFieldBuilder(field, data) {
  switch(field.type) {
    case "TEXTFIELD": return new TextFieldBuilder(field, data);
    case "DATE": return new DateFieldBuilder(field, data);
    case "TEXTAREA": return new TextAreaFieldBuilder(field, data);
    case "RANGE": return new RangeFieldBuilder(field, data);
    case "LIST": return new ListFieldBuilder(field, data);
    case "COUNTRYLIST": return new CountryListFieldBuilder(field, data);
    case "CHECKBOX": return new CheckboxFieldBuilder(field, data);
    case "RADIO": return new RadioFieldBuilder(field, data);
    case "ID": return new IDFieldBuilder(field, data);
    default: return new EmptyFieldBuilder(field, data);
  }
}


function isAnswerNotApplicable(melaCase, columnId) {
  var field = melaCase.survey.fields[columnId];
  var answer = melaCase.data[columnId];

  if (nonApplicableFields.indexOf(field.label) > -1) {
    if (!field.possibleAnswers) field.possibleAnswers = field.constraints.split("|");
    return (field.possibleAnswers.indexOf(answer) == field.possibleAnswers.length-1);
  }

  return false;
}

function caseAnswerCoverage(melaCase) {
  var survey = melaCase.survey;

  var questions = 0;
  var answers = 0;
  var notApplicable = 0;
  for(var i=0; i<survey.columns.length; i++) {
    var columnId = melaCase.survey.columns[i];
    var field = melaCase.survey.fields[columnId];
    if (!field.type) continue;

    var answer = melaCase.data[columnId];

    if (isAnswerNotApplicable(melaCase, columnId)) notApplicable++;

    questions++;

    if (answer) answers++;
  }
  return "<span style='color:#AAA; '>" + answers + " / " + questions + " / " + "</span>" + "<b>" + notApplicable + "</b>";
}

function sideviewBuildCaseHtml(melaCase, selectedMelacase) {
  var cssClasses = (melaCase == selectedMelacase) ? "selected" : "";
  cssClasses += " " + melaCase.survey.info.cssClass;

  var coverage = caseAnswerCoverage(melaCase);

  var caseHtml = $("<div class='caseDetails {0}'><dl><dt>{1}</dt><dd>{2}, {3} </dd></dl></div>"
    .format(cssClasses, melaCase.data.col_E, melaCase.data.col_G, coverage));
  $("#cases_list").append(caseHtml);

  caseHtml.click(function() {
    $("#cases_list .selected").removeClass("selected")
    caseHtml.addClass("selected");
    sideviewShowDetails(melaCase);
    var marker = map.findMarkerForCase(melaCase);
    if (marker) {
      map.showMarkerInfo(marker, melaCase);
    }
  })
}

function sideviewList(survey, selectedMelacase, dontClear) {
  sideviewCollapse();

  if (dontClear == false || dontClear === undefined) $("#cases_list dl").remove();

  //$("#cases_list").attr("class", ""); //remove all classes
  //$("#cases_list").addClass(survey.info.cssClass);

  for(var i=0; i<survey.cases.length; i++) {
    var melaCase = survey.cases[i];
    sideviewBuildCaseHtml(melaCase, selectedMelacase);
  }

  map.resize();
}

function sideviewListCases(cases) {
  $("#cases_list dl").remove();
  for(var i=0; i<cases.length; i++) {
    sideviewBuildCaseHtml(cases[i], null);
  }
}

function sideviewShowDetails(melacase) {
	sideviewCurrentCase = melacase;
  //$("#details").show();
  //$("#cases_list").hide();
  if (!melacase) {
    $("#sideview #details").html("");
    return;
  }

	var inline = "";

  inline += "<a href='javascript:sideviewEdit();'>Edit</a>";
	inline += "<h2>" + melacase.data.col_E + "</h2>";
	inline += "<dl>";
  for(var i=0; i<melacase.survey.columns.length; i++) {
    var columnId = melacase.survey.columns[i];
    var field = melacase.survey.fields[columnId];
    var data = melacase.data[columnId] || "";
    var fieldBuilder = sideviewGetFieldBuilder(field, data);
    var html = fieldBuilder.toDisplayHtml();
    if (!html) {
      html += "<dt>" + field.label + "</dt>";
      html += "<dd>&nbsp;</dd>";
    }
    inline += html;
	}
	inline += "</dl>";

	$("#sideview #details").html(inline);
}

printAll = function() {
	var inline = "";

  for(var ci in surveys[1].cases) {
    var melacase = surveys[1].cases[ci];
    inline += "<a href='javascript:sideviewEdit();'>Edit</a>";
  	inline += "<h2>" + melacase.data.col_E + "</h2>";
  	inline += "<dl>";
    for(var i=0; i<melacase.survey.columns.length; i++) {
      var columnId = melacase.survey.columns[i];
      var field = melacase.survey.fields[columnId];
      var data = melacase.data[columnId] || "";
      var fieldBuilder = sideviewGetFieldBuilder(field, data);
      var html = fieldBuilder.toDisplayHtml();
      if (!html) {
        html += "<dt>" + field.label + "</dt>";
        html += "<dd>&nbsp;</dd>";
      }
      inline += html;
  	}
  	inline += "</dl>";
  }
  console.log(inline);
}

function sideviewDelete() {
  if (sideviewCurrentCase == null) return;

  var yes = confirm("Are you sure to delete : " + sideviewCurrentCase.data.col_E + "?");
  if (yes) {
    var c = sideviewCurrentCase;
    var marker = map.findMarkerForCase(c);
    map.removeMarker(marker);
    c.survey.cases.splice(c.survey.cases.indexOf(c), 1);
    sideviewCurrentCase = null;


    var cellUpdateData = {
      spreadsheet: c.survey.id,
      data: {id:c.data.col_A},
      action: "delete"
    }

    $(".formLinks").html("<img src='img/loader.gif' /> Deleting... ");
    $.post("gapi.php", cellUpdateData, function(response) {
      console.log(response);
      sideviewList(c.survey);
      sideviewCloseEdit();
    });
  }
}

function sideviewEdit() {
  sideviewExpand();

	var melacase = sideviewCurrentCase;

	var inline = "";
  inline += "<div class='formLinks'>"
  inline += "<a href='javascript:sideviewSendForm();' class='buttonLink'>Update</a>";
  inline += " &nbsp; ";
  inline += "<a href='javascript:sideviewCloseEdit();' class=''>Cancel</a>";
  inline += "<a href='javascript:sideviewDelete();' class='buttonLink right'>Delete</a>";
  inline += "</div>"
	inline += "<h2>" + melacase.data.col_E + "</h2>";
	inline += "<dl>";
  for(var i=0; i<melacase.survey.columns.length; i++) {
    var columnId = melacase.survey.columns[i];
    var field = melacase.survey.fields[columnId];
    var na = isAnswerNotApplicable(melacase, columnId);
    var empty = (field.type && !melacase.data[columnId]);
    if (field.section) {
      inline += "</dl>";
      inline += "<h3>" + field.section + "</h3>";
      inline += "<dl>";
    }
    var data = melacase.data[columnId] || "";
    var fieldBuilder = sideviewGetFieldBuilder(field, data);
    if (na || empty) inline += "<div style='background: rgba(255, 0, 0, 0.1); padding: 0.5em'>";
    inline += fieldBuilder.toEditFormHtml();
    if (na || empty) inline += "</div>";
 	}

	inline += "</dl>";

	$("#sideview #details").html(inline);
}

function sideviewExpand() {
  $("#cases_list").hide();
  $("#sideview").css("width", "50%");
  setTimeout(function() {
      map.resize();
  }, 10);

}

function sideviewCollapse() {
  $("#cases_list").show();
  $("#sideview").css("width", "35%");
  setTimeout(function() {
      map.resize();
  }, 10);


}


function sideviewAdd(survey) {
  sideviewExpand();

  sideviewCurrentCase = null;
  sideviewCurrentSurvey = survey;

  console.log(sideviewCurrentSurvey);

	var inline = "";
  inline += "<div class='formLinks'>"
  inline += "<a href='javascript:sideviewSendForm();' class='buttonLink'>Add</a>";
  inline += " &nbsp; ";
  inline += "<a href='javascript:sideviewCloseEdit();' class=''>Cancel</a>";
  inline += "</div>"
	inline += "<dl>";
  for(var i=0; i<survey.columns.length; i++) {
    var columnId = survey.columns[i];
    var field = survey.fields[columnId];
    if (field.section) {
      inline += "</dl>";
      inline += "<h3>" + field.section + "</h3>";
      inline += "<dl>";
    }
    var fieldBuilder = sideviewGetFieldBuilder(field, "");
    inline += fieldBuilder.toEditFormHtml();
	}
	inline += "</dl>";

	$("#sideview #details").html(inline);
}


function sideviewCloseEdit() {
  var melacase = sideviewCurrentCase;
  sideviewShowDetails(melacase);
  sideviewCollapse();
}

function sideviewSendForm() {
  var survey = sideviewCurrentCase ? sideviewCurrentCase.survey : sideviewCurrentSurvey;

  if (!survey) {
    console.log("sideviewSendForm : Undefinied survey");
    return;
  }
  var data = {};

  var newCase = null;

  if (!sideviewCurrentCase) {
    newCase = new MelaCase(sideviewCurrentSurvey);
  }

  for(var i=0; i<survey.columns.length; i++) {
    var field = survey.fields[survey.columns[i]];
    var fieldBuilder = sideviewGetFieldBuilder(field, null);
    var value = fieldBuilder.getValue() || "";

    if (sideviewCurrentCase) {
      sideviewCurrentCase.data[field.col] = value;
      sideviewCurrentCase.data[survey.columns[i]] = value;
    }
    if (newCase) {
      newCase.data[field.col] = value;
      newCase.data[survey.columns[i]] = value;
    }

    data[field.columnName] = value;
  }
  //console.log("sideviewSendForm ", data);
  //console.log(sideviewCurrentCase);
  var cellUpdateData = {
    spreadsheet: survey.id,
    data: data,
    action: sideviewCurrentCase ? "update" : "add"
  }

  $(".formLinks").html("<img src='img/loader.gif' /> Sending... ");
  $.post("gapi.php", cellUpdateData, function(response) {
    console.log(response);
    if (response.indexOf("ERROR") !== -1) {
      alert("ERROR!");
      sideviewCloseEdit();
    }
    if (sideviewCurrentCase) {
      var marker = map.findMarkerForCase(sideviewCurrentCase);
      map.removeMarker(marker);
    }
    else if (newCase) {
      sideviewCurrentCase = newCase;
      sideviewCurrentCase.survey.cases.push(sideviewCurrentCase);
    }

    if (sideviewCurrentCase) {
      sideviewList(sideviewCurrentCase.survey, sideviewCurrentCase);
      sideviewShowDetails(sideviewCurrentCase);
      map.marker_cb(sideviewCurrentCase, true);
    }
  }, "text")
}
