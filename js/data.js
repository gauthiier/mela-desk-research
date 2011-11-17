//-- data model ----------------------------------------------------------------

var columnList = [
  'timestamp', "Time stamp",
  'nameoftheinstitutionorganisation', "Institution",
  'country', "Country",
  'city', "City",
  'typeofinstitutionorganisation', "Type of institution",
  'links', "Links",
  'name', "Name",
  'year', "Year",
  'namecontactofcuratororganizer', "Curator",
  'links_2', "Links 2",
  'description', "Description",
  'focusoftechnology', "Focus of technology",
  'targetgroup', "Target group",
  'whyisitofinterest', "Why is it of interest?",
  'impact-userperspective', "User perspective", 
  'impact-institutionorganisationperspective', "Institution perspective",
  'audienceinvolvment', "Audience involvment",
  'audienceengagement', "Audience engagement",
  'audienceperception', "Audience percpetion",
  'exhibitionelements', "Exhibition elements",
  'technologymetaphor', "Technology metaphor",
  'technologycontext', "Technology context",
  'identityconstruction', "Identity construction",
  'representation', "Representation",
  'historicalperspective', "Historical perspective",
  'stance', "Stance",
  'multinationalism', "Multinationalism",
  'affiliation', "Affiliation"
];

//single row of data describing single case in Mela desk research
function MelaCase() {
  //initialize all fields with empty values
  //each column has name and title so we have to skip index by 2 each time
  for(var i=0; i<columnList.length; i+=2) {
    var propertyName = columnList[i];
    this[propertyName] = "";
  }  
}

MelaCase.prototype.addEntry = function(entry) {
  var col = Number(entry.gs$cell.col) - 1;
  var propertyName = columnList[col*2];
  var value = entry.content.$t;
  if (!isNaN(value)) value = Number(value);
  this[propertyName] = value;
}

//-- data loading --------------------------------------------------------------

var loadData_callback;

function loadData(callback) {
  console.log("Loading data...");
  loadData_callback = callback;  
  var documentId = "0AlbpHfWQ4qzxdHRRaHUwREgxTlJUR0d6V3QwbENnUGc";
  jsonGetCellEntries(documentId, '1', 'jsonGetCellEntries_cb');
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

function jsonGetCellEntries_cb(json) {
  jsonParseCellEntries(json);
}

function jsonParseCellEntries(json) {
  //Rows row0 (column letter ids e.g. A,B,C) and
  //row1 (column names e.g. Timestamp, Country...)
  //will be empty (null)
  var rows = [];
  
  for (var i = 0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];

    //skipping header row
    if (entry.gs$cell.row == '1') {
      continue;      
    }
    
    if (!rows[entry.gs$cell.row]) {
      rows[entry.gs$cell.row] = new MelaCase();
    }
    
    rows[entry.gs$cell.row].addEntry(entry);    
  }
  
  //remove first two empty rows
  rows.shift();
  rows.shift();
  
  console.log("Loading data done");
    
  loadData_callback(rows);
}