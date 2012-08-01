var Parts = {
  "NN" : "noun",
  "VB" : "verb",
  "JJ" : "adjective"
}

function Set() {
  this.items = [];
  this.hashMap = {};
}

Set.prototype.add = function(value) {
  var item = this.hashMap[value];
  if (!item) {
    item = {
      value : value,
      count : 0
    }
    this.items.push(item);
    this.hashMap[value] = item;
  }
  item.count++;
}

var fs = require('fs');

var util = require('util');
var exec = require('child_process').exec;

var nouns = new Set();
var verbs = new Set();
var adjectives = new Set();

var descriptionTokens = fs.readFileSync('data/description.tokens.txt', 'utf-8').split('\n');
console.log(descriptionTokens.length);

function parseWords(wordsStr) {
  var words = wordsStr.replace("[(", "").replace(")]", "").split("), (").map(function(w) { return w.replace(/'/g, "").split(', ')});
  if (!words) return;
  for(var i=0; i<words.length; i++) {
    var word = words[i][0].toLowerCase();
    if (!word.match(/^[a-z]+/$)) continue;
    var part = words[i][1];
    if (part.indexOf("NN") == 0) nouns.add(word);
    else if (part.indexOf("VB") == 0) verbs.add(word);
    else if (part.indexOf("JJ") == 0) adjectives.add(word);
  }
}

descriptionTokens.forEach(function(wordsStr, i) {
  console.log(i+1 + "/" + descriptionTokens.length);
  if (wordsStr.length < 3) return;
  parseWords(wordsStr);
});

function sortAndCrop(set) {
  return set.items.filter(function(item) { return item.count > 1 }).sort(function(a, b) { return b.count - a.count});
}

fs.writeFileSync("data/nouns.json", JSON.serialize(sortAndCrop(nouns)));
fs.writeFileSync("data/verbs.json", JSON.serialize(sortAndCrop(verbs)));
fs.writeFileSync("data/adjectives.json", JSON.serialize(sortAndCrop(adjectives)));

console.log("Nouns", sortAndCrop(nouns).length, sortAndCrop(nouse));
console.log("Verbs", sortAndCrop(verbs).length, sortAndCrop(verbs));
console.log("Adjectives", sortAndCrop(adjectives).length, sortAndCrop(adjectives));

//var words = wordsStr.match(/([A-Za-z]+)([', ]+)([A-Za-z]+)/g);
//console.log(wordsStr);
//var wordsJSON = wordsStr.replace(/\(('[^']+'), ('[^']+')\)/g, "{'word':$1, 'type':$2}");
//console.log(wordsJSON);
//var words = JSON.parse(wordsJSON);
//console.log(words);

