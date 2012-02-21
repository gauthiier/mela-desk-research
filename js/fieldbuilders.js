//--- Utils --------------------------------------------------------

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/, ''); };

//--- TextFieldBuilder --------------------------------------------------------

function TextFieldBuilder(field, data) {
  this.field = field;
  this.data = data;
}

TextFieldBuilder.prototype.toDisplayHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>" + this.data + "</dd>";
  return html;
}

TextFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>";
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  html += "<input type='text' value='" + this.data + "'/>";
  html += "</dd>";
  return html;  
}

//--- TextAreaFieldBuilder ---------------------------------------------------------

function TextAreaFieldBuilder(field, data) {
  this.field = field;
  this.data = data;
}

TextAreaFieldBuilder.prototype.toDisplayHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>" + this.data + "</dd>";
  return html;
}

TextAreaFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>";
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  html += "<textarea rows='5' cols='50'>" + this.data + "</textarea>";
  html += "</dd>";
  return html;  
}

//--- RangeFieldBuilder ------------------------------------------------------------

function RangeFieldBuilder(field, data) {
  this.field = field;
  
  var constraints = field.constraints.split("|");
  this.min = Number(constraints[0]);
  this.max = Number(constraints[1]);
  this.minLabel = constraints[2];
  this.maxLabel = constraints[3];   
     
  this.data = data;
}

RangeFieldBuilder.prototype.toDisplayHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>" + this.data + "</dd>";
  return html;
}

RangeFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>";
  
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  
  html += "<table>";
  html += "<tr>";
  html += "<td>&nbsp;</td>"  
  for(var i=this.min; i<=this.max; i++) {
    html += "<td>" + i + "</td>";
  }  
  html += "<td>&nbsp;</td>"    
  html += "</tr>";  
  html += "<tr>";
  html += "<td>" + this.minLabel + "</td>";  
  for(var i=this.min; i<=this.max; i++) {
    var checked = (i == this.data) ? "checked='checked'" : "";
    html += "<td><input type='radio' " + checked + "/></td>";
  }  
  html += "<td>" + this.maxLabel + "</td>";
  html += "</tr>";    
  html += "</table>";  
  html += "</dd>";
  return html;  
}

//--- ListFieldBuilder -------------------------------------------------------------

function ListFieldBuilder(field, data) {
  this.field = field;
  this.options = field.constraints.split("|");
  this.data = data;
}

ListFieldBuilder.prototype.toDisplayHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>" + this.data + "</dd>";
  return html;
}

ListFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>";
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  html += "<select>";
  for(var i=0; i<this.options.length; i++) {
    var selected = (this.options[i] == this.data) ? "selected='selected'" : "";
    html += "<option " + selected + " value='" + this.options[i] + "'>" + this.options[i] + "</option>";
  }
  html += "</select>";
  html += "</dd>";
  return html;  
}

//--- CountryListFieldBuilder -------------------------------------------------------------

function CountryListFieldBuilder(field, data) {
  this.field = field;
  this.data = data;
}

CountryListFieldBuilder.prototype.toDisplayHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>" + this.data + "</dd>";
  return html;
}

CountryListFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>";
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  html += "<select>";
  for(var i=0; i<countryList.length; i++) {
    var selected = (countryList[i] == this.data) ? "selected='selected'" : "";
    html += "<option " + selected + " value='" + countryList[i] + "'>" + countryList[i] + "</option>";
  }
  html += "</select>";
  html += "</dd>";
  return html;  
}

//--- CheckboxFieldBuilder -------------------------------------------------------------

function CheckboxFieldBuilder(field, data) {
  this.field = field;
  this.options = field.constraints.split("|");
  this.selectedOptions = data.split(",");
  for(var i=0; i<this.selectedOptions.length; i++) {
    this.selectedOptions[i] = this.selectedOptions[i].trim();
  }
  this.data = data;
}

CheckboxFieldBuilder.prototype.toDisplayHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>" + this.data + "</dd>";
  return html;
}

CheckboxFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>";
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  html += "<ul>";
  var everChecked = false;
  console.log(this.selectedOptions);
  for(var i=0; i<this.options.length; i++) {
    var checked = (this.selectedOptions.indexOf(this.options[i]) > -1) ? "checked='checked'" : "";
    console.log(this.selectedOptions.indexOf(this.options[i]), checked);
    everChecked = everChecked || checked.length > 0;
    var needsInput = (i == this.options.length-1 && this.options[i].charAt(this.options[i].length-1) == ":");
    var inputValue = "";
    if (needsInput && !everChecked) {
      checked = "checked='checked'";
      inputValue = this.selectedOptions[this.selectedOptions.length-1];
    }
    var textInput = needsInput ? " <input type='text' value='" + inputValue + "'/>" : "";
    html += "<li><input type='checkbox' value='" + this.options[i] + "'" + checked +"/> " + this.options[i] + textInput + "</option></li>";
  }
  html += "</ul>";  
  html += "</dd>";
  return html;  
}

//--- RadioFieldBuilder -------------------------------------------------------------

function RadioFieldBuilder(field, data) {
  this.field = field;
  this.options = field.constraints.split("|");
  this.selectedOptions = data.split(",");
  for(var i=0; i<this.selectedOptions.length; i++) {
    this.selectedOptions[i] = this.selectedOptions[i].trim();
  }
  this.data = data;
}

RadioFieldBuilder.prototype.toDisplayHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>" + this.data + "</dd>";
  return html;
}

RadioFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>";
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  html += "<ul>";
  var everChecked = false;
  console.log(this.selectedOptions);
  for(var i=0; i<this.options.length; i++) {
    var checked = (this.selectedOptions.indexOf(this.options[i]) > -1) ? "checked='checked'" : "";
    console.log(this.selectedOptions.indexOf(this.options[i]), checked);
    everChecked = everChecked || checked.length > 0;
    var needsInput = (i == this.options.length-1 && this.options[i].charAt(this.options[i].length-1) == ":");
    var inputValue = "";
    if (needsInput && !everChecked) {
      checked = "checked='checked'";
      inputValue = this.selectedOptions[this.selectedOptions.length-1];
    }
    var textInput = needsInput ? " <input type='text' value='" + inputValue + "'/>" : "";
    var name = "radio_" + this.field.col;
    html += "<li><input type='radio' value='" + this.options[i] + "'" + checked + " name='" + name + "'/> " + this.options[i] + textInput + "</option></li>";
  }
  html += "</ul>";  
  html += "</dd>";
  return html;  
}







