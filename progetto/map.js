import { get, set } from "./cache.js";

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

// all'aggiunta del poi viene ridimensionata la mappa affinchè tutti i marcatori siano visibili
function updateMapExtent() {
  const extent = ol.extent.createEmpty();
  markers.forEach((marker) => {
    ol.extent.extend(extent, marker.feature.getGeometry().getExtent());
  });

  map.getView().fit(extent, {
    padding: [5, 5, 5, 5],
  });
}

// funzione per aggiungere un marcatore
const addMarker = (point) => {
  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(point.lonlat)),
  });
  feature.id=point.id;
  const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature],
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        crossOrigin: 'anonymous',
        src: 'https://i.postimg.cc/KcNTTRTt/marker-map.png',
      }),
    }),
  });
  map.addLayer(layer);
  markers.push({ feature, layer });
  if(markers.length>1){
    updateMapExtent(); // Aggiorna l'estensione della mappa per visualizzare tutti i marcatori
  }

};

// funzione per rimuovere un marcatore
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
        window.location.href = "detail.html?id=" + feature.id;
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
setZoom(map, 10);
initOverlay(map);

// add markers
let poi = {};
const renderMarkers=(poi)=>{
  let i = 1;
  Object.keys(poi).forEach((id) => {
    const lon = poi[id].coords[0];
    const lat = poi[id].coords[1];
    addMarker({lonlat:[lon,lat], id: id});
  });
};

const callback = (resp) => {
  poi = JSON.parse(resp.result);
  if (Object.keys(poi).length != 0){
    renderMarkers(poi);
  };
};

get("poi_torino",callback);
