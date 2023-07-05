// Define the tile layer with OpenStreetMap tiles and attribution.
var theMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Define another tile layer with OpenTopoMap tiles and attribution.
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// Create a new map instance with specified center and zoom level.
let myMap = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});


// Add the 'theMap' tile layer to the map.
theMap.addTo(myMap)


// Create LayerGroups for tectonic plates and earthquakes.
let tectonicplates = new L.LayerGroup();
let earthquakes = new L.LayerGroup();


// Define base maps and overlay layers for layer control.
let baseMaps = {
  "Light Global": theMap,
  "To Po": topo
};

let overlays = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes
};

// Add a layer control to the map with the baseMaps and overlays.
L.control
  .layers(baseMaps, overlays, { collapsed: false })
  .addTo(myMap)


// Use d3.json to fetch earthquake data from USGS.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  console.log(data)



// Function to define the style of the circle markers based on earthquake magnitude.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }


// Function to determine the color based on earthquake magnitude.
  function getColor(magnitude) {
    if (magnitude > 90) {
      return "#ea2c2c";
    }
    if (magnitude > 70) {
      return "#ea822c";
    }
    if (magnitude > 50) {
      return "#ee9c00";
    }
    if (magnitude > 30) {
      return "#eecc00";
    }
    if (magnitude > 10) {
      return "#d4ee00";
    }
    return "#98ee00";
  }
  
// Function to calculate the radius of the circle marker based on earthquake magnitude.
  function getRadius(magnitude){
  if (magnitude === 0) {
    return 1;
  }

  return magnitude * 4;
  }
  
// Create a GeoJSON layer with circle markers for each earthquake feature.
  L.geoJson(data, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng);
  },
  style: styleInfo,
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "Magnitude: "
      + feature.properties.mag
      + "<br>Depth: "
      + feature.geometry.coordinates[2]
      + "<br>Location: "
      + feature.properties.place
    );
  }
}).addTo(earthquakes);

// Add the 'earthquakes' layer group to the map
earthquakes.addTo(myMap)

})



