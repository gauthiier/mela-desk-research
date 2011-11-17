function Map() {
    var latlng = new google.maps.LatLng(22.593, 1.757);
    var myOptions = {
      zoom: 2,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.gmap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}