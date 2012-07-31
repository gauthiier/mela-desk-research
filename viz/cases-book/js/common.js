var Fields = {
  FieldOfActivity : 8, //c
  Year : 10, // t
  Description : 22, //ta
  FocusOfTechnology : 23, //r
  TypeOfMediaExhibited : 26, // c
  ActionsAndMechanicsOfInteraction : 27, //ta
  WhyIsItOfInterestForMeLAsResearchField05 : 29, //ta
  AudienceEngagement : 34, //rng
  ExhibitionElements : 36, //rng
  TechnologyMetaphor : 37 //rng
}

var Colors = {
  White : chroma.hex('#fff'),
  SkyBlue : chroma.hex('#55c1dc'),
  TomatoRed : chroma.hex('#eb6909'),
  Cyan : chroma.hex('#00EDBA')
}

//-----------------------------------------------------------------------------

Utils = {};
Utils.mean = function() {

}

//-----------------------------------------------------------------------------

function DataSource() {
  this.data = [];
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
        fields[i] = null;
      }
    }
    data.splice(0, 4); //remove metadata

    self.data = data;
    self.fields = fields;

    if (self.isoCountries.length > 0) callback();
    else self.onLoadCallback = callback; //wait for iso countries to finish loading
  });
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

DataSource.prototype.findAndCountAllPossibleValues = function(data, fieldId) {
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

  var casesValues = data.map(getValues(fieldId));
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

  return result.sort(sorterDesc("count"));
}

DataSource.prototype.findAllPossibleValues = function(data, fieldId) {
  return this.findAndCountAllPossibleValues(data, fieldId).map(function(o) { return o.value; });
}


DataSource.prototype.unrollData = function(data, fieldId) {
  function clone(melaCase) {
    var newCase = {};
    for(var i in melaCase) {
      newCase[i] = melaCase[i];
    }
    return newCase;
  }

  var cases = [];
  data.forEach(function(melaCase) {
    var values = melaCase[fieldId].split("|");
    for(var value in values) {
      var newCase = clone(melaCase);
      newCase[fieldId] = values[value];
      cases.push(newCase);
    }
  })

  return cases;
}

DataSource.prototype.sum = function(values) {
  return values.reduce(function(total, value) { return total + value; }, 0);
}

DataSource.prototype.calcMean = function(values) {
  return this.sum(values) / values.length;
}

DataSource.prototype.calcStdDev = function(values) {
  var n = values.length;

  var meanOfSquares = 0;
  values.forEach(function(value) { meanOfSquares += value * value; })
  meanOfSquares = meanOfSquares / n;

  var mean = this.calcMean(values);
  var squareOfMean = mean * mean;

  return Math.sqrt(meanOfSquares - squareOfMean);
}

DataSource.prototype.calcStdDev2 = function(values) {
  var n = values.length;
  var mean = this.calcMean(values);

  var dsum = 0;
  for(var i=0; i<n; i++) {
    dsum += (values[i] - mean) * (values[i] - mean);
  }

  return Math.sqrt(dsum/n);

}


DataSource.prototype.valuesToNumbers = function(data, fieldId) {
  var possibleValues = this.findAllPossibleValues(data, fieldId);
  return data.map(function(melaCase) {
    return possibleValues.indexOf(melaCase[fieldId]);
  })
}

DataSource.prototype.correlation = function(data, fieldId1, fieldId2) {
  var numValues1 = this.valuesToNumbers(data, fieldId1);
  var numValues2 = this.valuesToNumbers(data, fieldId2)
  var mean1 = this.calcMean(numValues1);
  var mean2 = this.calcMean(numValues2);
  var stdDev1 = this.calcStdDev(numValues1);
  var stdDev2 = this.calcStdDev(numValues2);

  var n = data.length;
  var sum = 0;
  for(var i=0; i<n; i++) {
    sum += numValues1[i] * numValues2[i];
  }

  return (1/(n - 1) * (sum - n * mean1 * mean2)) / (stdDev1 * stdDev2);
}

/*

*/


