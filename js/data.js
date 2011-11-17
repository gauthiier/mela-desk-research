//-- data labels ---------------------------------------------------------------

var columnList = [
  'timestamp', 'Time stamp',
  'nameoftheinstitutionorganisation', 'Institution',
  'country', 'Country',
  'city', 'City',
  'typeofinstitutionorganisation', 'Type of institution',
  'links', 'Links',
  'name', 'Name',
  'year', 'Year',
  'namecontactofcuratororganizer', 'Curator',
  'links_2', 'Links 2',
  'description', 'Description',
  'focusoftechnology', 'Focus of technology',
  'targetgroup', 'Target group',
  'whyisitofinterest', 'Why is it of interest?',
  'impact-userperspective', 'User perspective', 
  'impact-institutionorganisationperspective', 'Institution perspective',
  'audienceinvolvment', 'Audience involvment',
  'audienceengagement', 'Audience engagement',
  'audienceperception', 'Audience percpetion',
  'exhibitionelements', 'Exhibition elements',
  'technologymetaphor', 'Technology metaphor',
  'technologycontext', 'Technology context',
  'identityconstruction', 'Identity construction',
  'representation', 'Representation',
  'historicalperspective', 'Historical perspective',
  'stance', 'Stance',
  'multinationalism', 'Multinationalism',
  'affiliation', 'Affiliation'
];

var columnLabels = {
  'audienceinvolvment' : ['passive', 'active', 'Measure of the cases in terms of how much interaction (physical or otherwise) they expect or require.'],
  'audienceengagement' : ['individual', 'collective', 'Measure of the cases in terms of the intention or actuality of them to be experience by many people simultaneously, or by one individual at a time.'],
  'audienceperception' : ['immersive', 'reflective', 'Measure of the cases in terms of physical or cognitively engaging it is intended to be.  We place in opposition here tendencies towards "artistic" or "interpretive" forms, versus more informational, pedagogic or didactic strategies.'],
  'exhibitionelements' : ['object', 'virtual', 'Measure of the cases as to their predominantly digital, simulated, distributed features, as opposed to physical, bodily and situated applications.'],
  'technologymetaphor' : ['tool', 'map', 'Measure of the cases in terms of the facility they give audiences or users to explore or "probe" an informational or factual landscape.  This is juxtaposed to a tendency to use technologies to help situate users or audiences within this same landscape or field.'],
  'technologycontext' : ['mobile', 'stationary', 'Measure of the cases in terms of their ability to be translated, transported or movable by users or audiences.'],
  'identityconstruction' : ['personal', 'institutional', 'Measure of the cases in terms of thier capacity to reflect the opinions, experience or narratives of individual, or whether they articulates a more systematic, impersonal and formal inclination.'],
  'representation' : ['minority', 'majority', 'Measure of the cases in terms of the intention or actuality to project the views, histories, artifacts or particulars of a marginalised, minority or little know outlook or approach.'],
  'historicalperspective' : ['contempory', 'historical', 'Measure of the cases in terms of their historical emphasis.  Do they project a contemporary world view (recent events, news, accounts) in some way, or are ideas projected through a more traditionally historical viewpoint?'],
  'stance' : ['conservative', 'historical', 'Measure of the cases in terms of he degree to which they attempt to become an "agent for change", putting forward a new, challenging or provocative worldview.'],
  'multinationalism' : ['trans-national', 'national', 'Measure of the cases in terms of their emphasis or attitude towards nationalism and patriotism, opposed here to a more international or global frame of mind.']
}

var columnCategories = {
  'Categorization - User Experience' : ['audienceinvolvment', 'audienceengagement', 'audienceperception'],
  'Categorization - Exhibition Design, Technology Strategies / Methods' : ['exhibitionelements', 'technologymetaphor', 'technologycontext'],
  'Categorization - Institution / Organisation Purpose': ['identityconstruction', 'representation', 'historicalperspective', 'stance', 'multinationalism']
}
            
//-- data model ----------------------------------------------------------------

//single row of data describing single case in Mela desk research
function MelaCase() {
  //initialize all fields with empty values
  //each column has name and title so we have to skip index by 2 each time
  for(var i=0; i<columnList.length; i+=2) {
    var propertyName = columnList[i];
    this[propertyName] = '';
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
  console.log('Loading data...');
  loadData_callback = callback;  
  var documentId = '0AlbpHfWQ4qzxdHRRaHUwREgxTlJUR0d6V3QwbENnUGc';
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
  
  console.log('Loading data done');
    
  loadData_callback(rows);
}