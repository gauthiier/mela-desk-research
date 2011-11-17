function Map() {
    var latlng = new google.maps.LatLng(22.593, 1.757);
    var myOptions = {
      zoom: 2,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.gmap = new google.maps.Map(document.getElementById("mapcontent"), myOptions);
}

var timeout = 700;
Map.prototype.displayCases = function(casesList) {
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
                               function(res, status) {
                                    if(status == google.maps.GeocoderStatus.OK && res.length > 0) {
                                        marker(res[0].geometry.location, melacase);
                                    }
                                }
                              );
}

Map.prototype.marker = function (location, melacase) {
    var latlng = location;
    var m = new google.maps.Marker({
       position: latlng,
       map: this.gmap,
       title: melacase.nameoftheinstitutionorganisation,
       draggable: false
    });
    google.maps.event.addListener(m, 'click',
        function close(k) {
          return function() {
            showDetails(k);
          }
        }(melacase)
    );
}


