var the_map;

$(function(){

  $("input[placeholder]").each(function () {
    $(this).attr('size', $(this).attr('placeholder').length);
  });

  $("#address-input").focus(function(){
    $("#reminder").show();
  });

  the_map = L.map('map');

  $(".leaflet-control-zoom").css("visibility", "hidden");

  var layer = Tangram.leafletLayer({
    attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
  });
  layer.addTo(the_map);

  the_map.setView([40.693817467738924, -73.92976999282837], 11);

  var bar_urls = {
    manhattan: 'https://data.ny.gov/api/views/avba-r49v/rows.csv?accessType=DOWNLOAD',
    bronx: 'https://data.ny.gov/api/views/njae-48a5/rows.csv?accessType=DOWNLOAD',
    brooklyn: 'https://data.ny.gov/api/views/ufbc-kndb/rows.csv?accessType=DOWNLOAD',
    queens: 'https://data.ny.gov/api/views/nz46-medg/rows.csv?accessType=DOWNLOAD',
    staten_island: "https://data.ny.gov/api/views/s3h7-cmgk/rows.csv?accessType=DOWNLOAD"
  };

  $("#submit").click(function(){

    var borough = $("#borough-input").val();

    if (!borough){
      $("#pick-one").show();
      return;
    }

    var address = $("#address-input").val();
    var bars_url = bar_urls[borough];

    var search_key = 'search-BRxMWr7';
    var search_url = "https://search.mapzen.com/v1/search?api_key=" + search_key + "&text="+ address;

    $.get(search_url, function(response){
      
      var geocoded = response.features[0].geometry.coordinates.reverse();
      var label = $("#counter-label");

      $.get(bars_url, function(bars){
        
        var split_bars = bars.split("\n");
        var total = split_bars.length;
        split_bars.shift();
        $("#input").hide();
        $("#header").hide();
        $("#twitter").hide();
        var points = split_bars.map(function(bar){  
          var latitude  = bar.split(',')[4];
          var longitude = bar.split(',')[5];
          return [longitude, latitude];
        });

        (function sleepyLoop (i) {          
          setTimeout(function(){
            drawDirections(points[i], geocoded);
            if (--i) {
              label.text((total - i) + ' / ' + total);
              sleepyLoop(i);
            }
          }, 550);
        })(points.length - 1);
      });   
    });
  });
});

function drawDirections(point, geocoded){
  var request = "/directions?origin=" + JSON.stringify([point[1], point[0]]) + "&destination=" + JSON.stringify([geocoded[0], geocoded[1]]);
  $.get(request, function(response){
    if(response.length > 2){
      drawPolyline(JSON.parse(JSON.parse(response)));
      $(".leaflet-control-zoom").css("visibility", "visible");
    }
  });
}

function drawPolyline(decoded){
  var polyline = L.polyline(decoded, {
    color: 'white',
    weight: 3,
    opacity: 0.2,
    smoothFactor: 1
  });
  polyline.addTo(the_map);
}

function decode(encoded){
  return polyline.decode(encoded).map(function(coordinates){
    return [coordinates[1] / 10, coordinates[0] / 10];
  });
}