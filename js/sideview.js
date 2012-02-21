var sideviewCurrentCase = null;

function sideviewGetFieldBuilder(field, data) {
  switch(field.type) {
    case "TEXTFIELD": return new TextFieldBuilder(field, data);     
    case "TEXTAREA": return new TextAreaFieldBuilder(field, data); 
    case "RANGE": return new RangeFieldBuilder(field, data); 
    case "LIST": return new ListFieldBuilder(field, data); 
    case "COUNTRYLIST": return new CountryListFieldBuilder(field, data);     
    case "CHECKBOX": return new CheckboxFieldBuilder(field, data);     
    case "RADIO": return new RadioFieldBuilder(field, data);     
    default: return new TextFieldBuilder(field, data); 
  }
}

function emitDetails(melacase) {
	var details = $("#" + melacase.survey.detailsdiv);
	var inline = "";
  inline += "<a href='javascript:sideviewEdit();'>Edit</a>";  
	inline += "<h2>" + melacase.data.col_B+ "</h2>";
	inline += "<dl>";
	for(var k in melacase.data) {
    var fieldBuilder = sideviewGetFieldBuilder(melacase.survey.fields[k], melacase.data[k]);
    inline += fieldBuilder.toDisplayHtml();
	}		
	inline += "</dl>";		 
	details.html(inline);
	return details;		
}

function emitEditForm(melacase) {
	var details = $("#" + melacase.survey.detailsdiv);
	var inline = "";
  inline += "<a href='javascript:sideviewEdit();'>Edit</a>";  
	inline += "<h2>" + melacase.data.col_B+ "</h2>";
	inline += "<dl>";
	for(var k in melacase.data) {
    var fieldBuilder = sideviewGetFieldBuilder(melacase.survey.fields[k], melacase.data[k]);
    inline += fieldBuilder.toEditFormHtml();
	}		
	inline += "</dl>";		 
	details.html(inline);
	return details;		
}


function showDetails(melacase) {
	sideviewCurrentCase = melacase;
	var details = emitDetails(melacase);
  $("#sideview").html(details);
  
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
}

function sideviewEdit() {
  console.log("sideviewEdit");
	var editForm = emitEditForm(sideviewCurrentCase);
  $("#sideview").html(editForm);
  
}