if (!window.console) {
  window.console = {
    log: function(msg) {}
  }
}

function init() {
  console.log("Init");    
  loadData(dataLoaded_cb, docID);
}


//called when data is finished loading data
function dataLoaded_cb(survey) {

  console.log(survey.cases);

  if(survey.cases.length > 0) {
    for(i = 0; i < survey.cases.length; i++) {
        var c = survey.cases[i];
        for(k in c.data) {
            console.log(survey.labels[k]);
            console.log(c.data[k]);
        }
    }
  } else {
    console.log('Dataset empty...')
  }
  
}

$(document).ready(init);
