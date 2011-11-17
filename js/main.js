if (!window.console) {
  window.console = {
    log: function(msg) {}
  }
}

function init() {
  console.log("Init");
  loadData(dataLoaded_cb);
}

//called when data is finished loading data
function dataLoaded_cb(casesList) {
  console.log("Number of loaded cases: " + casesList.length);
  
  var clusters = new Clusters(casesList);
  //var map = new Map();
  //map.displayCases(casesList);
  
}

$(document).ready(init);
