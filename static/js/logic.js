
// data retrieved from the url
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(data => {
    createMap(data.features);
});

//  map created using the tile layer
function createMap(earthquakeData) {

    let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let map = L.map("map", {
        center: [40.73, -74.0059],
        zoom: 12,
        layers: [streetMap]
    });

    //  style added to the tile layer
    function styleInfo(feature) {
        return {
            fillColor: getColor(feature.geometry.coordinates[2]), 
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        };
    }

    //  color added for the legend
    function getColor(depth) {
        return depth > 100 ? "#800026" :
            depth > 70  ? "#BD0026" :
            depth > 50  ? "#E31A1C" :
            depth > 30  ? "#FC4E2A" :
            depth > 10  ? "yellow" :
                          "green";
    }

    //  radius function defined for the marker on the map
    function getRadius(magnitude) {
        return magnitude === 0 ? 1 : magnitude * 5;
    }

    //  earthquake data added on the map and added information to be added in the marker pop for each feature
    L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><p>Magnitude: ${feature.properties.mag}</p>`);
        }
    }).addTo(map);


    let legend = L.control({ position: 'bottomright' });
    //  legend created 
    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend');
        let depth = [0, 10, 30, 50, 70, 100];
        let labels = [];

        for (let i = 0; i < depth.length; i++) {
            labels.push(
                `<i style="background: ${getColor(depth[i] + 1)}"></i> ${depth[i]}${depth[i + 1] ? `&ndash;${depth[i + 1]}` : '+'}`
            );
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);
}
