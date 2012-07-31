function Options() {
  this.items = [];

  this.parseUrlString();
}

Options.prototype.parseUrlString = function() {
  var queryStart = document.location.href.indexOf("?");
  if (queryStart !== -1) {
    var queryStr = document.location.href.substr(queryStart + 1);
    var params = queryStr.split("&").map(function(paramStr) {
      var param = paramStr.split("=");
      return {
        name : param[0],
        value : (param[1] == "true") ? true : false
      }
    })
    if (params.length > 0) {
        this.items = params;
    }
  }
}

Options.prototype.add = function(name, labelStr, value, group) {
  var item = this.getItemByName(name);
  if (!item) {
    item =  {
      name: name,
      value : value
    }
    this.items.push(item);
  }

  item.group = group;

  var label = document.createElement("label");
  var labelText = document.createTextNode(labelStr);
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  label.appendChild(checkbox);
  label.appendChild(labelText);
  document.getElementById("options").appendChild(label);

  if (item.value) checkbox.checked = item.value;

  var self = this;

  checkbox.addEventListener('click', function() {
    item.value = checkbox.checked;

    console.log(item.group, item.value);
    if (item.group && item.value) {
      self.items.forEach(function(otherItem) {
        if (otherItem != item && otherItem.group == item.group) {
          otherItem.value = false;
        }
      })
    }

    self.refreshPage();
  })
}

Options.prototype.addBreak = function() {
  var breakEl = document.createElement("hr");
  document.getElementById("options").appendChild(breakEl);
}

Options.prototype.getItemByName = function(name) {
  return _.filter(this.items, function(o) { return o.name == name; })[0];
}

Options.prototype.getValue = function(name) {
  return this.getItemByName(name).value;
}

Options.prototype.setValue = function(name, value) {
  return this.getItemByName(name).value = value;
}

Options.prototype.refreshPage = function() {
  function getNameValue(o) { return o.name + "=" + o.value; }

  var queryString = this.items.map(getNameValue).join("&");
  document.location.href = document.location.pathname + "?" + queryString;
}