function emitDetails(melacase) {
	var details = $("#" + melacase.survey.detailsdiv);
	var inline = "";
	inline += "<h2>" + melacase.data.col_B+ "</h2>";
	inline += "<dl>";
	for(k in melacase.data) {
		inline += "<dt>" + melacase.survey.labels[k] + "</dt>";
		// need to know if we work with numbers or paragraph text etc...
		// as defined in datatypes		
		var cl = "";
		if(typeof(melacase.survey.datatypes) != 'undefined' && k in melacase.survey.datatypes) {
			cl = "class=" + melacase.survey.datatypes[k];
		}
		inline += "<dd " + cl + ">" + melacase.data[k] + "</dd>";
	}		
	inline += "</dl>";		 
	details.html(inline);
	return details;		
}

function showDetails(melacase) {
	
	var details;
	if(typeof(melacase.survey.emitdetails) === 'undefined' || !melacase.survey.emitdetails) {
  	details = $($("#" + melacase.survey.detailsdiv).render(melacase));
		$("#sideview").html(details);
	} else if(typeof(melacase.survey.emitdetails) != 'undefined' && melacase.survey.emitdetails) {
		details = emitDetails(melacase);
		$("#sideview").html(details);
	}
	
  //adds bar representing the value next to the value number
  details.find(".number").each(function() {
    var field = $(this);
    var value = Number(field.text());
    if (isNaN(value)) value = 0;

    var columnName = field.attr("data-column");
    var labels = columnLabels[columnName];

    field.html(
      "<div class='barContainer'>" +
      "<div class='low'>"+labels[0]+"</div>" +
      "<div class='hi'>"+labels[1]+"</div>" +
      "<div class='value' style='left:" + (value * 20 + 1) + "%'>"+value+"</div>" +
      "<div class='bar'>" +
      "<div class='barvalue' style='width:" + (value * 20) + "%'></div>" +
      "</div>"+
      "</div>"
    )
  })

  //converts text links to html <a href>
  details.find(".links").each(function() {
    var field = $(this);
    var links = field.text().split(/[ \n]/);
    var html = "";
    $(links).each(function() {
      html += "<a href='" + this + "'>" + this + "</a>\n";
    });
    field.html(html);
  });
}