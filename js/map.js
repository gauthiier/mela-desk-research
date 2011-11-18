function Map() {
  console.log('Loading map...');
  var latlng = new google.maps.LatLng(22.593, 1.757);
  var myOptions = {
    zoom: 2,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.gmap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  this.m = null;

  var self = this;
  $(window).bind('resize', function(e) {
    self.resize();
  });

  this.resize();

}

var timeout = 700;
Map.prototype.displayCases = function(casesList) {
  console.log('Loading cases...');
  var who = this;
  for(var i=0; i<casesList.length; i++) {
        setTimeout((function close(k) {
                      return function() {
                        who.marker_cb(k);
                      }
                    })(casesList[i]), timeout * i);
  }  
}

Map.prototype.marker_cb = function (melacase) {
  var geocoder = new google.maps.Geocoder();
  var pos = geocoder.geocode({'address' : melacase.nameoftheinstitutionorganisation + ' , '
                                        + melacase.city + ' , '
                                        + melacase.country
                             },
                             function close(map, casedata) {
                               return function(res, status) {
                                    if(status == google.maps.GeocoderStatus.OK && res.length > 0) {
                                        map.marker(res[0].geometry.location, casedata);
                                    }
                                }
                             }(this, melacase));
}

Map.prototype.marker = function (location, melacase) {
  var latlng = location;
  var m = new google.maps.Marker({
     position: latlng,
     map: this.gmap,
     title: melacase.nameoftheinstitutionorganisation,
     draggable: false,
     icon: "img/marker_white.png"
  });
  var c = this.markerContent(melacase);
  var info = new google.maps.InfoWindow({
     content: c
  });
  m.info = info;
  google.maps.event.addListener(m, 'click',
      function close(k, map) {
        return function() {
          if(map.m) {
            map.m.setOptions({icon: "img/marker_grey.png"});
            map.m.info.close();
          }
          showDetails(k);
          m.setOptions({icon: "img/marker_turq.png"});
          m.info.open(map.gmap,m);
          map.m = m;
        }
      }(melacase, this)
  );
}

Map.prototype.markerContent = function (melacase) {
  var content = '<div class="infowindow">';
  content += '<div id="title">' + melacase.name + '</div>';
  content += '<div id="place">' + melacase.nameoftheinstitutionorganisation + '</div>';
  content += '<div id="place">' + melacase.city + ', ' + melacase.country + '</div>';
  content += '</div>';
  return content;
}

Map.prototype.resize = function() {
  var sideviewW = $("#sideview").width();
  var windowW = $(window).width();
  $("#clusters").css("width", (windowW - sideviewW - 1) + "px");
  google.maps.event.trigger(this.gmap, 'resize');
}


