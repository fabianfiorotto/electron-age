require('../js/entities/types');

const ResourceManager = require("../resources");
const MapView = require('../ui/map/map');
const DebugInfo = require('../ui/debug/debug');

require("sylvester");

window.resources = new ResourceManager();

var mapView = new MapView();
var debugInfo = new DebugInfo();

document.addEventListener("DOMContentLoaded", async function() {
  await debugInfo.bind('debug');
  setInterval(() => debugInfo.resetFps(), 1000);
  await mapView.bind('map');
  let options = {

  };
  await mapView.loadTestMap(options);

  for await(let _null of resources.timeoutIterable()) {
    mapView.draw();
    debugInfo.incFps();
  }
  return 1;
});
