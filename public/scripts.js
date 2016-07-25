$(function(){

  $("input[placeholder]").each(function () {
    $(this).attr('size', $(this).attr('placeholder').length);
  });

  map = L.map('map');

  $(".leaflet-control-zoom").css("visibility", "hidden");

  var layer = Tangram.leafletLayer({
    attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
  });

  layer.addTo(map);

  map.setView([40.693817467738924, -73.92976999282837], 11);

  $("#submit").click(function(){
    var base = "/directions?";
    var params = "address=" + $("#address").val();
    var request = $.getJSON(base + params);
    $.when(request).done(function(response){
      response.forEach(function(polyline){
        var pointList = L.PolylineUtil.decode(polyline).map(function(point){
          return point.map(function(coordinate){
            return coordinate / 10;
          });
        });
        L.polyline(pointList, {
          color: 'white',
          weight: 3,
          opacity: 0.2,
          smoothFactor: 1
        }).addTo(map);
      });
      $(".leaflet-control-zoom").css("visibility", "visible");
    });
  });
});