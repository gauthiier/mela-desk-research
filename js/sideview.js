var sideviewCurrentCase = null;
var sideviewCurrentSurvey = null;

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

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
    default: return new EmptyFieldBuilder(field, data);
  }
}

function sideviewList(survey, selectedMelacase, dontClear) {
  if (dontClear == false || dontClear === undefined) $("#cases_list").empty();

  //$("#cases_list").attr("class", ""); //remove all classes
  //$("#cases_list").addClass(survey.info.cssClass);

  function buildCaseHtml(melaCase) {
    var cssClasses = (melaCase == selectedMelacase) ? "selected" : "";
    cssClasses += " " + survey.info.cssClass;
    var caseHtml = $("<div class='caseDetails {0}'><dl><dt>{1}</dt><dd>{2}</dd></dl></div>".format(cssClasses, melaCase.data.col_D, melaCase.data.col_F));
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

  for(var i=0; i<survey.cases.length; i++) {
    var melaCase = survey.cases[i];
    buildCaseHtml(melaCase);
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
	inline += "<h2>" + melacase.data.col_D + "</h2>";
	inline += "<dl>";
  for(var i=0; i<melacase.survey.columns.length; i++) {
    var columnId = melacase.survey.columns[i];
    var field = melacase.survey.fields[columnId];
    var data = melacase.data[columnId] || "";
    var fieldBuilder = sideviewGetFieldBuilder(field, data);
    inline += fieldBuilder.toDisplayHtml();
	}
	inline += "</dl>";

	$("#sideview #details").html(inline);
}


function sideviewEdit() {
  //$("#details").show();
  //$("#cases_list").hide();

	var melacase = sideviewCurrentCase;

	var inline = "";
  inline += "<a href='javascript:sideviewSendForm();' class='buttonLink'>Update</a>";
  inline += " &nbsp; ";
  inline += "<a href='javascript:sideviewCloseEdit();' class=''>Cancel</a>";
	inline += "<h2>" + melacase.data.col_D + "</h2>";
	inline += "<dl>";
  for(var i=0; i<melacase.survey.columns.length; i++) {
    var columnId = melacase.survey.columns[i];
    var field = melacase.survey.fields[columnId];
    if (field.section) {
      inline += "</dl>";
      inline += "<h3>" + field.section + "</h3>";
      inline += "<dl>";
    }
    var data = melacase.data[columnId] || "";
    var fieldBuilder = sideviewGetFieldBuilder(field, data);
    inline += fieldBuilder.toEditFormHtml();
	}
	inline += "</dl>";

	$("#sideview #details").html(inline);
}

function sideviewAdd(survey) {
  //$("#details").show();
  //$("#cases_list").hide();

  sideviewCurrentCase = null;
  sideviewCurrentSurvey = survey;

  console.log(sideviewCurrentSurvey);

	var inline = "";
  inline += "<a href='javascript:sideviewSendForm();' class='buttonLink'>Send</a>";
  inline += " &nbsp; ";
  inline += "<a href='javascript:sideviewCloseEdit();' class=''>Cancel</a>";
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
    row: sideviewCurrentCase ? sideviewCurrentCase.row : null,
    data: data,
    action: sideviewCurrentCase ? "update" : "add"
  }
  $.get("gapi.php", cellUpdateData, function(response) {

    if (response.indexOf("ERROR") !== -1) {
      alert("ERROR!");
      sideviewCloseEdit();
    }
    if (sideviewCurrentCase) {
      var marker = map.findMarkerForCase(sideviewCurrentCase);
      map.removeMarker(marker);
      map.marker_cb(sideviewCurrentCase, true);
      sideviewShowDetails(sideviewCurrentCase);
    }
    else if (newCase) {
      sideviewCurrentCase = newCase;
      newCase.survey.cases.push(newCase);
      sideviewList(newCase.survey, newCase);
      sideviewShowDetails(newCase);
      map.marker_cb(newCase, true);
    }
  }, "text")
}
