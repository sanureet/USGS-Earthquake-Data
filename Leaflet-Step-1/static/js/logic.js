// Earthquake data link
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
// Perform a GET request to the query URL
d3.json(url).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
    
    // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Size the circle by magnitude
  function circlesize(magnitude) {
    return magnitude * 2000
  }

  // color the circle by depth
  function circlecolor(magnitude){
    if (magnitude <1) {
      return "#ccff33"
    }
    else if (magnitude <2) {
      return "#ffff33"
    }
    else if (magnitude <3) {
      return "#ffcc33"
    }
    else if (magnitude <4) {
      return "#ff9933"
    }
    else if (magnitude <5) {
      return "#ff6633"
    }
    else {
      return "#ff3333"
    }
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
var tectonicplates = new L.LayerGroup();
function createMap(earthquakes) {

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});
// add layer
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// Create a baseMaps object
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satellite
  };

// Create overlay object to hold our overlay layer
var overlayMaps = {
    "Tectonic Plates": tectonicplates,
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
      center: [15.5994, -28.6731],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  L.circleMarker([latitude, longitude], {
    fillOpacity: 0.75,
    color: "blue",
    fillColor: circlecolor(magnitude),
    weight: 1,
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its population
    radius: circlesize(magnitude)
  }).bindPopup("<h1>" + location + "</h1> <hr> <h3>time: " + magnitude+ "</h3>").addTo(myMap);
}


  // color function to be used when creating legend
  // function getcolor(d) {
  //   return d >5 ? "#ff3333":
  //         d >4 ? "#ff6633":
  //         d >3 ? "#ff9933":
  //         d >2 ? "#ffcc33":
  //         d >1 ? "#ffff33":
  //                "#ccff33";
  // }

  
// Add legend (don't forget to add the CSS from index.html)
// Link source https://github.com/timwis/leaflet-choropleth/blob/gh-pages/examples/legend/demo.js
var legend = L.control({ position: 'bottomright' })

  legend.onAdd = function (Map) {

  var div = L.DomUtil.create('div', 'info legend');
  var magnitudes = [0, 1, 2, 3, 4, 5];
  var labels = [];

  // for (var i = 0; i <magnitudes.length; i++){}

  // // Add min & max
  // div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
  //   <div class="max">' + limits[limits.length - 1] + '</div></div>'

  // limits.forEach(function (limit, index) {
  //   labels.push('<li style="background-color: ' + colors[index] + '"></li>')
  // })

  // div.innerHTML += '<ul>' + labels.join('') + '</ul>'
  return div
  };
  legend.addTo(myMap);








// L.control.layers(baseMaps, overlayMaps).addTo(myMap);


d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plateData){
  L.geoJSON(plateData,
    {color: "blue",
    weight: 3})
    .addTo(tectonicplates);
});
