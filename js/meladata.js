//-- data model ----------------------------------------------------------------

//HELLO IE!
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
    for(var i=0; i<this.length; i++){
      if(this[i]==obj) {
        return i;
      }
    }
    return -1;
  }
}

// MelaSurvey -> global data for a given survey
function MelaSurvey(docID) {
  this.columns = [];
  this.columnNames = [];
	this.fields = [];
	this.cases = [];
	this.id = docID;
  this.headerRows = ["label", "description", "type", "constraints"];
}

//first row of data in the survey table is labeling data (column name)
MelaSurvey.prototype.addFieldInfo = function(entry) {
	var row = Number(entry.gs$cell.row);
  var col = Number(entry.gs$cell.col) - 1;
  this.columns[col] = toColName(col);
  var propertyName = this.headerRows[row - 1];
	var value = entry.content.$t;
  if (!this.fields[toColName(col)]) {
    this.fields[toColName(col)] = {};
    this.fields[toColName(col)].col = col;
  }
  if (propertyName == "label") {
    var columnName = value.replace(/[^A-Za-z0-9\-\.]+/g,'').toLowerCase();
    if (this.columnNames.indexOf(columnName) !== -1) {
      var i = 2;
      var name = columnName + "_" + i
      while(this.columnNames.indexOf(name) !== -1) {
        name = columnName + "_" + ++i
      }
      columnName = name;
    }
    this.columnNames.push(columnName);
    this.fields[toColName(col)].columnName = columnName;
  }
	this.fields[toColName(col)][propertyName] = value;
}

// MelaCase -> rows in table
//single row of data describing single case in Mela desk research
function MelaCase(survey, row) {
	this.data = new Array();
	this.survey = survey;
  this.row = row;
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

function loadData(docID, callback) {
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

    var isHeaderRow = Number(entry.gs$cell.row) <= survey.headerRows.length;

    if (isHeaderRow) {
      survey.addFieldInfo(entry);
    }
    else {
      if (!survey.cases[entry.gs$cell.row]) {
        survey.cases[entry.gs$cell.row] = new MelaCase(survey, entry.gs$cell.row);
      }

      survey.cases[entry.gs$cell.row].addEntry(entry);
    }
  }

  //remove empty header rows
  while(survey.cases.length > 0 && !survey.cases[0]) {
    survey.cases.shift();
  }
  console.log('Loading data done');

  loadData_callback(survey);
}