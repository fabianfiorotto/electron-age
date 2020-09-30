require('./js/entities/types');

const ResourceManager = require("./resources");
const MapView = require('./js/ui/map');

require("sylvester");
const fs = require('fs').promises;

var mapView = new MapView();

window.resources = new ResourceManager();
var fps = 0;

document.addEventListener("DOMContentLoaded", function() {
  var idle, loop, resetFps;

  var showFps = document.getElementById("fps");

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
