function Map() {
  console.log('Loading map...');
  var latlng = new google.maps.LatLng(22.593, 1.757);
  var myOptions = {
    zoom: 2,
    center: latlng,
		panControl: false,
		scaleControl: false,
		zoomControl: true,
		zoomControlOptions: {
		  style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.gmap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  this.m = null;

  var self = this;
  $(window).bind('resize', function(e) {
    self.resize();
  });

  this.resize();

  this.markers = [];
	console.log('Loading map done.');

}

var timeout = 700;
Map.prototype.displayCases = function(casesList) {
  console.log('Loading map cases...');
  var who = this;
  for(var i=0; i<casesList.length; i++) {
        setTimeout((function close(k, i) {
                      return function() {
                        who.marker_cb(k);
                      }
                    })(casesList[i], i), timeout * i);
  }
	console.log('Loading map cases done.');
}

Map.prototype.marker_cb = function (melacase) {
  var geocoder = new google.maps.Geocoder();
  var pos = geocoder.geocode({'address' : melacase.data.col_D + ' , '
                                        + melacase.data.col_C
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
     title: melacase.data.col_B,
     draggable: false,
     icon: "img/" + melacase.survey.info.mapicon,
     originalicion: "img/" + melacase.survey.info.mapicon,
     melacase: melacase
  });
  var c = this.markerContent(melacase);
  var info = new google.maps.InfoWindow({
     content: c
  });
  m.info = info;
  var self = this;
  google.maps.event.addListener(m, 'click',
      function() {
        self.showMarkerInfo(m, melacase);
        sideviewList(melacase.survey, melacase);
      }
  );
  this.markers.push(m);
}

Map.prototype.showMarkerInfo = function(m, melacase) {
  if(this.m) {
    this.m.setOptions({icon: this.m.originalicion});
    this.m.info.close();
  }
  if (melacase) {
    sideviewShowDetails(melacase);
  }
  if (m) {
    m.setOptions({icon: "img/marker_white.png"});
    m.info.open(this.gmap, m);
  }
  this.m = m;
}

Map.prototype.markerContent = function (melacase) {
  var content = '<div class="infowindow">';
  content += '<div id="title">' + melacase.data.col_B + '</div>';
  content += '<div id="place">' + melacase.data.col_B + '</div>';
  content += '<div id="place">' + melacase.data.col_D + ', ' + melacase.data.col_C + '</div>';
  content += '</div>';
  return content;
}

Map.prototype.resize = function() {
  var sideviewW = $("#sideview").width();
  var casesListW = $("#cases_list").width();
  var windowW = $(window).width();
  $("#map_container").css("width", (windowW - sideviewW - casesListW - 2) + "px");
  google.maps.event.trigger(this.gmap, 'resize');
}

Map.prototype.findMarkerForCase = function(melacase) {
  for(var i=0; i<this.markers.length; i++) {
    if (this.markers[i].melacase == melacase) {
      return this.markers[i];
    }
  }
  return null;
}


