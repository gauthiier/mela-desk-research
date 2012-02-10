//-- data model ----------------------------------------------------------------

// MelaSurvey -> global data for a given survey
function MelaSurvey(docID) {
	this.labels = [];
	this.cases = [];
	this.id = docID;
}

//first row of data in the survey table is labeling data (column name)
MelaSurvey.prototype.addLabel = function(entry) {
	var row = Number(entry.gs$cell.row);
	if(row != 1) return;
	var col = Number(entry.gs$cell.col) - 1;
	var value = entry.content.$t;
	this.labels[toColName(col)] = value;
}

// MelaCase -> rows in table
//single row of data describing single case in Mela desk research
function MelaCase(survey) {
	this.data = new Array();
	this.survey = survey;
}

MelaCase.prototype.addEntry = function(entry) {
  var col = Number(entry.gs$cell.col) - 1;
  var value = entry.content.$t;
  if (!isNaN(value)) value = Number(value);
  this.data[toColName(col)] = value;   
}

// converts column index to google doc column labels
// (i.e. 1 = col_A, 2 = col_B, ..., 27 = col_AA, 28 = col_AB, etc..)
// all MelaCases are indexed with this scheme (i.e. melacase.data.col_A = first column in spreadsheet data)
function toColName(colnbr) {
	var name = "col_";
	if(colnbr < 26) {
		name += String.fromCharCode(65 + colnbr);
	} else {
		var n = Math.floor(colnbr / 25);
		for(var i = 0; i < n; i++) {
			name += String.fromCharCode(65 + i);
		}
		var r = colnbr - (n * 25) - 1;
		name += String.fromCharCode(65 + r);        
	}
	return name;
}


//-- data loading --------------------------------------------------------------

var loadData_callback;
var documentId;

function loadData(callback, docID) {
  console.log('Loading data...');
  loadData_callback = callback;  
  documentId = docID;
  jsonGetCellEntries(documentId, '1', 'jsonGetCellEntries_cb');
}

function loadDataRaw(callback, docID) {
  console.log('Loading data...');
  documentId = docID;
  jsonGetCellEntries(documentId, '1', callback);
}


function jsonClearCellScript() {
  var jsonScript = document.getElementById('json_cell_data_script');
    if (jsonScript) {
      jsonScript.parentNode.removeChild(jsonScript);
  }
}

function jsonGetCellEntries(key, worksheetnbr, callback_fn) {
  jsonClearCellScript();
    
  var script = document.createElement('script');
  script.setAttribute('src', 'http://spreadsheets.google.com/feeds/'
                         + 'cells'
                         + '/' + key
                         + '/' + worksheetnbr
                         + '/public/values'
                         + '?alt=json-in-script&callback='
                         + callback_fn
                        );

  script.setAttribute('id', 'json_cell_data_script');
  script.setAttribute('type', 'text/javascript');
  document.documentElement.firstChild.appendChild(script);    
}

function jsonGetListEntries(key, worksheetnbr, callback_fn) {
  jsonClearCellScript();
    
  var script = document.createElement('script');
  script.setAttribute('src', 'http://spreadsheets.google.com/feeds/'
                         + 'list'
                         + '/' + key
                         + '/' + worksheetnbr
                         + '/public/values'
                         + '?alt=json-in-script&callback='
                         + callback_fn
                        );

  script.setAttribute('id', 'json_cell_data_script');
  script.setAttribute('type', 'text/javascript');
  document.documentElement.firstChild.appendChild(script);    
}


function jsonGetCellEntries_cb(json) {
  jsonParseCellEntries(json);
}

function jsonParseCellEntries(json) {
  
  var survey = new MelaSurvey(documentId);
  
  console.log('> Number of (cell) entries:' + json.feed.entry.length);
  
  for (var i = 0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];

    if (entry.gs$cell.row == '1') {
      survey.addLabel(entry);      
      continue;
    }
    
    if (!survey.cases[entry.gs$cell.row]) {
      survey.cases[entry.gs$cell.row] = new MelaCase(survey);
    }
    
    survey.cases[entry.gs$cell.row].addEntry(entry);    
  }
  
  survey.cases.shift();
  survey.cases.shift();
  
  console.log('Loading data done');
    
  loadData_callback(survey);
}