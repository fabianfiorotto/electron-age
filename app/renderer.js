require('./js/entities/types');

const ResourceManager = require("./resources");
const MapView = require('./js/ui/map');
const SimplePainter = require('./painters/simple');
const SmartPainter = require('./painters/smart');

require("sylvester");
const fs = require('fs').promises;
const simplePainter = new SimplePainter();
const smartPainter = new SmartPainter();

var mapView = new MapView();

window.resources = new ResourceManager();
var fps = 0;

// resources.painter = simplePainter;
resources.painter = smartPainter;

document.addEventListener("DOMContentLoaded", function() {
  var idle, loop, resetFps;

  var showFps = document.getElementById("fps");
  var toggleSmartPainter = document.getElementById('smart');

  toggleSmartPainter.checked = resources.painter === smartPainter;

  toggleSmartPainter.addEventListener('change', (e) => {
    resources.painter = e.target.checked ? smartPainter : simplePainter;
    mapView.refreshMap();
  });

  mapView.loadTestMap();
  mapView.documentReady();

  idle = function() {
    mapView.draw();
    fps += 1;
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

  resetFps = function() {
    showFps.textContent = fps;
    fps = 0;
  };
  setInterval(resetFps, 1000);

  loop();

  return 1;
});
