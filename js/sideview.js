function showDetails(caseData) {
  var details = $($("#caseDetails").render(caseData));
  $("#sideview").html(details);

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