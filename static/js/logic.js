// Creating the map object
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the GeoJSON data
d3.json(link).then(data => {
  // Function to determine marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 5; // Scale the size as needed
  }

  // Function to determine marker color based on depth
  function getColor(depth) {
    return depth > 100 ? '#FF0000' : // Red for deep earthquakes
           depth > 50  ? '#FF7F00' : // Orange
           depth > 20  ? '#FFFF00' : // Yellow
           depth > 0   ? '#7FFF00' : // Light Green
                         '#00FF00';  // Green for shallow earthquakes
  }

  // Loop through the features in the GeoJSON data
  data.features.forEach(feature => {
    let coords = feature.geometry.coordinates;
    let magnitude = feature.properties.mag;
    let depth = coords[2]; // Depth is the third coordinate

    // Create a circle marker
    L.circleMarker([coords[1], coords[0]], {
      radius: markerSize(magnitude),
      fillColor: getColor(depth),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
    .bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`)
    .addTo(myMap);
  });

  // Create a legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [0, 20, 50, 100];
    let labels = [];
    
    // Add a white background to the legend
    div.style.backgroundColor = 'white'; // Set background color
    div.style.padding = '10px'; // Add padding
    div.style.borderRadius = '5px'; // Add rounded corners
    div.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)'; // Add shadow for depth


    // Loop through depth intervals and generate a label with a colored square
    for (let i = 0; i < depths.length; i++) {
      // Define the color for the current depth
      let color = getColor(depths[i] + 1);
      
      // Add the colored square and depth range to the legend
      div.innerHTML +=
          '<i style="background:' + color + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
  };

  legend.addTo(myMap);
});