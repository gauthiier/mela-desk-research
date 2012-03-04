//--- Utils --------------------------------------------------------

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/, ''); };

//--- TextFieldBuilder --------------------------------------------------------

function TextFieldBuilder(field, data) {
  this.field = field;
  this.data = data;
}

TextFieldBuilder.prototype.toDisplayHtml = function() {
  if (!this.data) return "";

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
  html += "<input type='text' value='" + this.data + "' name='" + this.field.columnName + "'/>";
  html += "</dd>";
  return html;
}

TextFieldBuilder.prototype.getValue = function() {
  return $("input[name='"+this.field.columnName+"']").val();
}

//--- TextAreaFieldBuilder ---------------------------------------------------------

function TextAreaFieldBuilder(field, data) {
  this.field = field;
  this.data = data;
}

TextAreaFieldBuilder.prototype.toDisplayHtml = function() {
  if (!this.data) return "";

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
  html += "<textarea rows='5' cols='50' name='" + this.field.columnName + "'>" + this.data + "</textarea>";
  html += "</dd>";
  return html;
}

TextAreaFieldBuilder.prototype.getValue = function() {
  return $("input[name='"+this.field.columnName+"']").val();
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
  if (!this.data) return "";

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
    html += "<td><input type='radio' " + checked + " name='" + this.field.columnName + "' value='" + i + "'/></td>";
  }
  html += "<td>" + this.maxLabel + "</td>";
  html += "</tr>";
  html += "</table>";
  html += "</dd>";
  return html;
}

RangeFieldBuilder.prototype.getValue = function() {
  return $("input[name='"+this.field.columnName+"']:checked").val();
}

//--- ListFieldBuilder -------------------------------------------------------------

function ListFieldBuilder(field, data) {
  this.field = field;
  this.options = field.constraints.split("|");
  this.data = data;
}

ListFieldBuilder.prototype.toDisplayHtml = function() {
  if (!this.data) return "";

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
  html += "<select name='" + this.field.columnName + "'>";
  for(var i=0; i<this.options.length; i++) {
    var selected = (this.options[i] == this.data) ? "selected='selected'" : "";
    html += "<option " + selected + " value='" + this.options[i] + "'>" + this.options[i] + "</option>";
  }
  html += "</select>";
  html += "</dd>";
  return html;
}

ListFieldBuilder.prototype.getValue = function() {
  return $("select[name='"+this.field.columnName+"']").val();
}

//--- CountryListFieldBuilder -------------------------------------------------------------

function CountryListFieldBuilder(field, data) {
  this.field = field;
  this.data = data;
}

CountryListFieldBuilder.prototype.toDisplayHtml = function() {
  if (!this.data) return "";

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
  html += "<select name='" + this.field.columnName + "'>";
  for(var i=0; i<countryList.length; i++) {
    var selected = (countryList[i] == this.data) ? "selected='selected'" : "";
    html += "<option " + selected + " value='" + countryList[i] + "'>" + countryList[i] + "</option>";
  }
  html += "</select>";
  html += "</dd>";
  return html;
}

CountryListFieldBuilder.prototype.getValue = function() {
  return $("select[name='"+this.field.columnName+"']").val();
}

//--- CheckboxFieldBuilder -------------------------------------------------------------

function CheckboxFieldBuilder(field, data) {
  this.field = field;
  this.options = field.constraints.split("|");
  this.selectedOptions = data ? data.split("|") : [];
  for(var i=0; i<this.selectedOptions.length; i++) {
    this.selectedOptions[i] = this.selectedOptions[i].trim();
  }
  this.data = data;
}

CheckboxFieldBuilder.prototype.toDisplayHtml = function() {
  if (!this.data) return "";

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
  for(var i=0; i<this.options.length; i++) {
    var checked = (this.selectedOptions.indexOf(this.options[i]) > -1) ? "checked='checked'" : "";
    everChecked = everChecked || checked.length > 0;
    var needsInput = (i == this.options.length-1 && this.options[i].charAt(this.options[i].length-1) == ":");
    var inputValue = "";
    if (needsInput && !everChecked) {
      checked = "checked='checked'";
      inputValue = this.selectedOptions[this.selectedOptions.length-1];
    }
    var textInput = needsInput ? " <input type='text' value='" + inputValue + "'/>" : "";
    html += "<li><input type='checkbox' value='" + this.options[i] + "'" + checked +" name='" + this.field.columnName + "'/> " + this.options[i] + textInput + "</option></li>";
  }
  html += "</ul>";
  html += "</dd>";
  return html;
}

CheckboxFieldBuilder.prototype.getValue = function() {
  var values = [];
  $("input[name='"+this.field.columnName+"']:checked").each(function() { if ($(this).is(':checked')) values.push($(this).val()); });
  return values.join("|");
}

//--- RadioFieldBuilder -------------------------------------------------------------

function RadioFieldBuilder(field, data) {
  this.field = field;
  this.options = field.constraints.split("|");
  this.selectedOptions = data ? data.split(",") : [];
  for(var i=0; i<this.selectedOptions.length; i++) {
    this.selectedOptions[i] = this.selectedOptions[i].trim();
  }
  this.data = data;
}

RadioFieldBuilder.prototype.toDisplayHtml = function() {
  if (!this.data) return "";

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
  for(var i=0; i<this.options.length; i++) {
    var checked = (this.selectedOptions.indexOf(this.options[i]) > -1) ? "checked='checked'" : "";
    everChecked = everChecked || checked.length > 0;
    var needsInput = (i == this.options.length-1 && this.options[i].charAt(this.options[i].length-1) == ":");
    var inputValue = "";
    if (needsInput && !everChecked) {
      checked = "checked='checked'";
      inputValue = this.selectedOptions[this.selectedOptions.length-1];
    }
    var textInput = needsInput ? " <input type='text' value='" + inputValue + "'/>" : "";
    html += "<li><input type='radio' value='" + this.options[i] + "'" + checked + " name='" + this.field.columnName + "'/> " + this.options[i] + textInput + "</option></li>";
  }
  html += "</ul>";
  html += "</dd>";
  return html;
}

RadioFieldBuilder.prototype.getValue = function() {
  return $("input[name='"+this.field.columnName+"']:checked").val();
}


//--- DateFieldBuilder --------------------------------------------------------

function DateFieldBuilder(field, data) {
  this.field = field;
  this.data = data;
}

DateFieldBuilder.prototype.toDisplayHtml = function() {
  if (!this.data) return "";

  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>" + this.data + "</dd>";
  return html;
}

DateFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "";
	html += "<dt>" + this.field.label + "</dt>";
	html += "<dd>";
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  var date = this.data || new Date();
  html += "<input type='text' readonly='readonly' value='" + date + "' name='" + this.field.columnName + "'/>";
  html += "</dd>";
  return html;
}

DateFieldBuilder.prototype.getValue = function() {
  return $("input[name='"+this.field.columnName+"']").val();
}

//--- EmptyFieldBuilder --------------------------------------------------------

function EmptyFieldBuilder(field, data) {
  this.field = field;
  this.data = data;
}

EmptyFieldBuilder.prototype.toDisplayHtml = function() {
  var html = "<h3>" + this.field.label + "</h3>";
  return html;
}

EmptyFieldBuilder.prototype.toEditFormHtml = function() {
  var html = "<h3>" + this.field.label + "</h3>";
	html += "<dd>";
  if (this.field.description) {
    html += "<p>" + this.field.description + "</p>";
  }
  html += "</dd>";
  return html;
}

EmptyFieldBuilder.prototype.getValue = function() {
  return "";
}






