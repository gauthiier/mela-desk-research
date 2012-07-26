function groupCasesBy(data, fieldId, fieldName, mappingFunc) {
  var clusters = {};

  data.forEach(function(melaCase) {
    var value = melaCase[fieldId];
    if (mappingFunc)
      value = mappingFunc(value);
    if (!clusters[value]) {
      clusters[value] = [];
    }
    clusters[value].push(melaCase)
  });
  var result = [];
  for(var value in clusters) {
    var list = {  cases:clusters[value] };
    list[fieldName] = value;
    result.push(list);
  }
  return result;
}

function parseYear(yearStr) {
  var yearNumber = Number(yearStr.substr(0, 4));
  if (isNaN(yearNumber)) return "  NA";
  return yearNumber;
}