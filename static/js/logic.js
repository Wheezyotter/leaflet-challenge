const usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let featureData = [];

d3.json(usgs_url).then(function(data) {
    featureData = (data.features);
    console.log(featureData);
    createFeatures(data);
});

function markerSize(magnitude) {
    return magnitude * 3;
}

function markerColor(depth) {
    if (depth <= 10) {
        return '#1fb008';
    } else if (depth < 20) {
        return '#46a500';
    } else if (depth < 30) {
        return '#5b9a00';
    } else if (depth < 40) {
        return '#698e00';
    } else if (depth < 50) {
        return '#748300';
    } else if (depth < 60) {
        return '#7b7700';
    } else if (depth < 70) {
        return '#816c00';
    } else if (depth < 80) {
        return '#856000';
    } else if (depth < 90) {
        return '#875500';
    } else if (depth < 100) {
        return '#874900';
    } else if (depth < 200) {
        return '#853e00';
    } else if (depth < 300) {
        return '#823200';
    } else if (depth < 400) {
        return '#7e2700';
    } else if (depth < 500) {
        return '#781c0a';
    } else {
        return '#711111';
    }
}

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><h4>Magnitude: ${feature.properties.mag}</h4><h4>Depth: ${feature.geometry.coordinates[2]}km</h4>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,

      pointToLayer: function(feature, latlng) {

        let earthquakeCircles = {
            stroke: false,
            fillOpacity: 0.90,
            color: "white",
            fillColor: markerColor(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag)
        }
        return L.circleMarker(latlng, earthquakeCircles);
      },      

    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Topographic Map": Esri_WorldImagery,
        "Street Map": street
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
        25.52, -5.34
        ],
        zoom: 3,
        layers: [Esri_WorldImagery, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

     // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let depths = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500]
        let labels = [];
        let legendInfo = "<h1>Depth:</h1>";

        div.innerHTML = legendInfo;

        for (let j = 0; j < depths.length; j++) {
            div.innerHTML += 
            '<i style=background:' + markerColor(depths[j] + 1) + '></i>' + 
            depths[j] + (depths[j + 1] ? '&ndash;' + depths[j+ 1] + 'km<br>' : '+');
        }
        return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
}