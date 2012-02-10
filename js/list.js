function createContentList(survey) {
  var table = document.createElement('table');
  table.setAttribute('id', 'output');
  table.setAttribute('cellspacing', '10');
  var tbody = document.createElement('tbody');
  var tr;

	// --- HEADER ---

	// case #
  tr = document.createElement('tr');
	var nbr = 0;
	var td = document.createElement('td');
	td.setAttribute("class", "list-title");
	td.appendChild(document.createTextNode("Case #"));
  tr.appendChild(td);
	
	// titles
  for( j in survey.labels) {
	  var td = document.createElement('td');
	  td.setAttribute("class", "list-title");
		if(survey.listwidths[j] != "undefined") {
			td.setAttribute("style", "width: " + survey.listwidths[j] + "px;");
		}		
	  td.appendChild(document.createTextNode(survey.labels[j]));
	  tr.appendChild(td);
  }
  tbody.appendChild(tr);

	// --- BODY ---
	
  for(i = 0; i < survey.cases.length; i++) {
		tr = document.createElement('tr');
		var melacase = survey.cases[i];
		// case #
    var td = document.createElement('td');
    td.setAttribute('class', 'list-element');
    td.appendChild(document.createTextNode(i + 1));
    tr.appendChild(td);		

		// data
		for(k in melacase.data)	{	
	    var td = document.createElement('td');
	    td.setAttribute('class', 'list-element');
	    td.appendChild(document.createTextNode(melacase.data[k]));
	    tr.appendChild(td);
		}
		tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  document.getElementById("list_container").appendChild(table);
}
