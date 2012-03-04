var sideviewCurrentCase = null;
var sideviewCurrentSurvey = null;

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
    default: return new TextFieldBuilder(field, data);
  }
}

function sideviewList(survey) {
  console.log(survey);
}

function sideviewShowDetails(melacase) {
	sideviewCurrentCase = melacase;
  if (!melacase) {
    $("#sideview #details").html("");
    return;
  }

	var inline = "";

  inline += "<a href='javascript:sideviewEdit();'>Edit</a>";
	inline += "<h2>" + melacase.data.col_B + "</h2>";
	inline += "<dl>";
  for(var i=0; i<melacase.survey.columns.length; i++) {
    var columnId = melacase.survey.columns[i];
    var field = melacase.survey.fields[columnId];
    var data = melacase.data[columnId] || "";
    if (field.section) {
      inline += "</dl>";
      inline += "<h3>" + field.section + "</h3>";
      inline += "<dl>";
    }
    var fieldBuilder = sideviewGetFieldBuilder(field, data);
    inline += fieldBuilder.toDisplayHtml();
	}
	inline += "</dl>";

	$("#sideview #details").html(inline);
}


function sideviewEdit() {
	var melacase = sideviewCurrentCase;

	var inline = "";
  inline += "<a href='javascript:sideviewSendForm();' class='buttonLink'>Update</a>";
  inline += " &nbsp; ";
  inline += "<a href='javascript:sideviewCloseEdit();' class=''>Cancel</a>";
	inline += "<h2>" + melacase.data.col_B + "</h2>";
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
  sideviewCurrentCase = null;
  sideviewCurrentSurvey = survey;

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

  for(var i=0; i<survey.columns.length; i++) {
    console.log(field);
    var field = survey.fields[survey.columns[i]];
    var fieldBuilder = sideviewGetFieldBuilder(field, null);
    var value = fieldBuilder.getValue() || "";

    if (sideviewCurrentCase)
      sideviewCurrentCase.data[field.col] = value;

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
    }
    console.log("response", response);
    sideviewCloseEdit();
  }, "text")
}

  //TODO: what is this doing?
  // if(typeof(melacase.survey.emitdetails) === 'undefined' || !melacase.survey.emitdetails) {
  //     details = $($("#" + melacase.survey.detailsdiv).render(melacase));
  //   $("#sideview").html(details);
  // } else if(typeof(melacase.survey.emitdetails) != 'undefined' && melacase.survey.emitdetails) {
  //   details = emitDetails(melacase);
  //   $("#sideview").html(details);
  // }

  // //adds bar representing the value next to the value number
  // details.find(".number").each(function() {
  //   var field = $(this);
  //   var value = Number(field.text());
  //   if (isNaN(value)) value = 0;
  //
  //   var columnName = field.attr("data-column");
  //   var labels = columnLabels[columnName];
  //
  //   field.html(
  //     "<div class='barContainer'>" +
  //     "<div class='low'>"+labels[0]+"</div>" +
  //     "<div class='hi'>"+labels[1]+"</div>" +
  //     "<div class='value' style='left:" + (value * 20 + 1) + "%'>"+value+"</div>" +
  //     "<div class='bar'>" +
  //     "<div class='barvalue' style='width:" + (value * 20) + "%'></div>" +
  //     "</div>"+
  //     "</div>"
  //   )
  // })
  //
  // //converts text links to html <a href>
  // details.find(".links").each(function() {
  //   var field = $(this);
  //   var links = field.text().split(/[ \n]/);
  //   var html = "";
  //   $(links).each(function() {
  //     html += "<a href='" + this + "'>" + this + "</a>\n";
  //   });
  //   field.html(html);
  // });
