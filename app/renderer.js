require('./js/entities/types');

const ResourceManager = require("./resources");
const MapView = require('./ui/map/map');
const DebugInfo = require('./ui/debug/debug');

require("sylvester");

window.resources = new ResourceManager();

var mapView = new MapView();
var debugInfo = new DebugInfo();

document.addEventListener("DOMContentLoaded", function() {
  var idle, loop;

  debugInfo.bind('debug');

  mapView.documentReady();
  mapView.loadTestMap();

  idle = function() {
    mapView.draw();
    debugInfo.incFps();
  };

  loop = function() {
    try {
      idle();
    } catch (e) {
      console.error(e, e.stack);
    } finally {
      setTimeout(loop, 1);
    }
  };

  setInterval(() => debugInfo.resetFps(), 1000);

  loop();

  return 1;
});
