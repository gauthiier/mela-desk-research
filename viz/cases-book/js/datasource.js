function DataSource(data) {
  this.data = data || [];
  this.isoCountries = [];
  this.loadCountryList();
}

DataSource.prototype.loadCountryList = function() {
  var self = this;
  d3.text("data/iso-countries.csv", function(list) {
    self.isoCountries = CSVToArray(list);

    if (self.onLoadCallback) {
      self.onLoadCallback();
      self.onLoadCallback = null;
    }
  });
}

DataSource.prototype.load = function(file, callback) {
  var self = this;
  d3.text(file, function(dataStr) {
    var data = CSVToArray(dataStr);

    var info = [];
    info.push("Field05 : " + data.length + " cases");
    var verbose = false;

    if (verbose) console.log(info);
    //build list of all fields and their types
    var fieldNames = data[0];
    var fieldTypes = data[2];
    var fieldValues = data[3];
    var fields = [];
    for(var i in fieldNames) {
      if (fieldTypes[i] != '') {
        fields[i] = {
          name : fieldNames[i],
          type : fieldTypes[i],
          values : fieldValues[i].split("|")
        }
        if (verbose) console.log(i, fieldNames[i], fieldTypes[i])
      }
      else {
        fields[i] = {
          name : fieldNames[i],
          type : null
        }
      }
    }
    data.splice(0, 4); //remove metadata

    self.data = data;
    self.fields = fields;

    if (self.isoCountries.length > 0) callback();
    else self.onLoadCallback = callback; //wait for iso countries to finish loading
  });
}

DataSource.prototype.printFields = function() {
  var str = '';
  fields.forEach(function(field, i) {
    if (!field) return;
    str += toTitleCase(field.name).replace(/\s/g, '');
    str += ' : ' + i + ', //' + field.type;
    str += '\n';
  })
}

DataSource.prototype.countryNameToIso = function(name) {
  var nameUpper = name.toUpperCase();
  if (name == "United States of America") {
    nameUpper = "UNITED STATES";
  }
  var matches = _.filter(this.isoCountries, function(country) {
    return nameUpper == country[0];
  })
  if (matches.length > 0) {
    return matches[0][1];
  }
  else {
    console.log("No ISO found for " + name);
    return "Unknown";
  }
}

DataSource.prototype.findAndCountAllPossibleValues = function(fieldId, sortMode) {

  sortMode = sortMode || "count";

  function getValues(fieldId) {
    return function(melaCase) {
      return melaCase[fieldId];
    }
  }

  function sorterDesc(property) {
    return function(a, b) {
      return -(a[property] - b[property]);
    }
  }

  var casesValues = this.data.map(getValues(fieldId));
  var values = {};

  function addValue(value) {
    if (!values[value]) values[value] = 0;
    values[value]++;
  }

  casesValues.forEach(function(value) {
    if (value.indexOf("|") !== -1)
      value.split("|").forEach(addValue);
    else
      addValue(value);
  })

  var result = [];
  for(var value in values) {
    result.push({value : value, count : values[value]});
  }

  return result.sort(sorterDesc(sortMode));
}

DataSource.prototype.findAndCountAllPossibleValuesMax = function(questionId) {
  var answers = this.findAndCountAllPossibleValues(questionId);
  var max = answers.reduce(function(max, answer) {
    return Math.max(max, answer.count);
  }, 0)
  return max;
}


DataSource.prototype.findAllPossibleValues = function(fieldId) {
  return this.findAndCountAllPossibleValues(fieldId).map(function(o) { return o.value; });
}

DataSource.prototype.valuesToNumbers = function(fieldId) {
  var possibleValues = this.findAllPossibleValues(fieldId);
  return this.data.map(function(melaCase) {
    //console.log(melaCase[fieldId], possibleValues.indexOf(melaCase[fieldId]));
    return possibleValues.indexOf(melaCase[fieldId]);
  })
}

DataSource.prototype.unrollData = function(fieldId) {
  function clone(melaCase) {
    var newCase = {};
    for(var i in melaCase) {
      newCase[i] = melaCase[i];
    }
    return newCase;
  }

  var cases = [];
  this.data.forEach(function(melaCase) {
    var values = melaCase[fieldId].split("|");
    for(var value in values) {
      var newCase = clone(melaCase);
      newCase[fieldId] = values[value];
      cases.push(newCase);
    }
  })

  var ds = new DataSource();
  ds.fields = this.fields;
  ds.data = cases;

  return ds;
}

DataSource.prototype.groupBy = function(fieldId, fieldName, mappingFunc) {
  var clusters = {};

  this.data.forEach(function(melaCase) {
    var value = melaCase[fieldId];
    if (mappingFunc)
      value = mappingFunc(value);
    if (!clusters[value]) {
      clusters[value] = new DataSource();
    }
    clusters[value].data.push(melaCase)
  });

  var result = [];
  for(var value in clusters) {
    var ds = clusters[value];
    ds.name = value;
    result.push(ds);
  }

  return result;
}

DataSource.prototype.countOptions = function(fieldId) {
  var count = [];
  var possibleValues = this.fields[fieldId].values;

  if (fields[fieldId].type == "RANGE") {
    for(var i=0; i<5; i++)
      count.push(0);
  }
  else {
    possibleValues.forEach(function(value, i) {
      count.push(0);
    });
  }

  data.forEach(function(melaCase) {
    var answer = melaCase[fieldId]
    if (fields[fieldId].type != "RANGE") {
      answer = answer.split("|");
      answer.forEach(function(a) {
        count[possibleValues.indexOf(a)]++;
      })
    }
    else {
      count[answer]++;
    }
  });
  if (fields[fieldId].type == "RANGE" && count.length > 5) {
    count.pop();
  }
  return count;
}
