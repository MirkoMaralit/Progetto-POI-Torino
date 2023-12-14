const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
let overlay;
let markers = [];
let map; 

function setLayers(map) {
  const layers = [new ol.layer.Tile({ source: new ol.source.OSM() })];
  map.addLayer(new window.ol.layer.Group({ layers }));
}

function setCenter(map, lonlat) {
  const center = window.ol.proj.fromLonLat(lonlat);
  map.getView().setCenter(center);
}

function setZoom(map, zoom) {
  map.getView().setZoom(zoom);
}

function updateMapExtent() {
  const extent = ol.extent.createEmpty();
  markers.forEach((marker) => {
    ol.extent.extend(extent, marker.feature.getGeometry().getExtent());
  });

  map.getView().fit(extent, {
    padding: [45, 45, 45, 45],
  });
}

const addMarker = (map, point) => {
  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(point.lonlat)),
  });
  feature.name = point.name;
  feature.description = point.description;

  const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature],
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        crossOrigin: 'anonymous',
        src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
      }),
    }),
  });

  map.on('click', function (e) {
    const feature = map.getFeaturesAtPixel(e.pixel);
    if (feature.length != 0) {
      Swal.fire({
        title: 'NOME:\n' + feature[0].name + '\nDESCRIZIONE:\n' + feature[0].description,
        position: 'top',
        background: 'white',
        showConfirmButton: true,
        showCancelButton: false,
      });
    }
  });

  map.addLayer(layer);
  markers.push({ feature, layer });
  if(markers.length>1){
    updateMapExtent(); // Aggiorna l'estensione della mappa per includere il nuovo marcatore
  }

};

const remove_marker = (i) => {
  map.removeLayer(markers[i].layer);
  markers.splice(i, 1);

  if(markers.length>1){
    updateMapExtent(); // Aggiorna l'estensione della mappa per includere il nuovo marcatore
  }
};

function initOverlay(map, points) {
  overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });
  map.addOverlay(overlay);
  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  map.on('singleclick', function (event) {
    if (map.hasFeatureAtPixel(event.pixel) === true) {
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        const coordinate = event.coordinate;
        overlay.setPosition(coordinate);
      });
    } else {
      overlay.setPosition(undefined);
      closer.blur();
    }
  });
}

// create map
map = new ol.Map({ target: document.querySelector('.map') });
map.height = screen.height / 1.6;
map.getViewport().style.height = map.height + 'px';  
setLayers(map);
setCenter(map, [7.687276482443367,45.067397442558494]);
setZoom(map, 12);
initOverlay(map);


//export{addMarker,remove_marker};
