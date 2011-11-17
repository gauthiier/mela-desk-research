function init() {
  console.log("Init");
  loadData(dataLoaded_cb);
}

//called when data is finished loading data
function dataLoaded_cb(casesList) {
  console.log("Number of loaded cases: " + casesList.length);
}

$(document).ready(init);
