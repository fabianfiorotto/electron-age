require('./js/entities/types');

const ResourceManager = require("./resources");
const AoeMap = require('./js/map');
const ScxMapBuilder = require('./js/scx/scx');
const TestBuilder = require('./js/test/testmap');

const TopBar = require('./js/ui/topbar');
const Dashboard = require('./js/ui/dashboard');

var topBar = new TopBar();
var dashboard = new Dashboard();

require("sylvester");
const fs = require('fs').promises;

window.resources = new ResourceManager();
var map;
var cameraPos = $V([0, 0]);
var fps = 0;

var loadMapScx = async function() {
  map = new AoeMap(120, 120); //No puedo dejar la variable map vacia!!
  // var file = await fs.open('/home/fabian/github/aldeano.scx', "r");
  var file = await fs.open('/home/fabian/github/test1.scx', "r");
  // var file = await fs.open('/home/fabian/github/agua.scx', "r");
  // var file = await fs.open('/home/fabian/github/paredes.scx', "r");
  // var file = await fs.open('/home/fabian/github/edificios.scx', "r");
  map = await ScxMapBuilder.load(file);
  cameraPos = map.initCameraPos;

  topBar.bind(map, 'top-bar');
  dashboard.bind(map, 'dashboard');
};

var loadMap = async function() {
  map = new AoeMap(120, 120); //No puedo dejar la variable map vacia!!
  map = await TestBuilder.loadTestMap();
  cameraPos = map.initCameraPos;

  topBar.bind(map, 'top-bar');
  dashboard.bind(map, 'dashboard');
  return map;
};

var eventCoords = function(e, cameraPos) {
  var dim = e.target.getBoundingClientRect();
  var x = e.clientX - dim.left;
  var y = e.clientY - dim.top;

  return $V([x, y]).add(cameraPos);
}

document.addEventListener("DOMContentLoaded", function() {
  var c, ctx, tr_c, tr_ctx, doKeyDown, idle, imgs;

  var showFps = document.getElementById("fps");
  var mapDiv = document.getElementById("map");

  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");

  tr_c = document.getElementById("terrainCanvas");
  tr_ctx = tr_c.getContext("2d");

  loadMap();
  // loadMapScx();

  c.addEventListener('mousemove', (e) => {
    map.over(eventCoords(e, cameraPos));
  });

  c.addEventListener('mousedown', (e) => {
    if (e.which == 1) {
      map.mouseDown(eventCoords(e, cameraPos));
    }
  });

  c.addEventListener('mouseup', (e) => {
    if (e.which == 1) {
      map.mouseUp(eventCoords(e, cameraPos));
    }
  });


  c.addEventListener('click', (e) => {
    map.leftClick(eventCoords(e, cameraPos));
  });

  window.addEventListener('contextmenu',function(e) {
    var dim = c.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;

    if (x >= 0 && y >=0 && x <= dim.width && y <= dim.height) {
      var v = $V([x, y]).add(cameraPos);
      map.rightClick(v);
    }
  });

  var resizeMap = function() {
    c.setAttribute('width', window.innerWidth);
    tr_c.setAttribute('width', window.innerWidth);
    c.setAttribute('height', window.innerHeight - 250);
    tr_c.setAttribute('height', window.innerHeight - 250);
    mapDiv.style.height = (window.innerHeight - 250) + "px";
    map.terrain.redraw = true;
    map.terrain.redraw = true;
  };

  window.addEventListener('resize',function(e) {
    resizeMap();
  });
  resizeMap();

  doKeyDown = function(e) {
    if (e.keyCode == 87) { //w
      cameraPos = cameraPos.add($V([0,-10]));
      map.terrain.redraw = true;
    }
    if (e.keyCode == 65) { //a
      cameraPos = cameraPos.add($V([-10, 0]));
      map.terrain.redraw = true;
    }
    if (e.keyCode == 83) { //s
      cameraPos = cameraPos.add($V([0, 10]));
      map.terrain.redraw = true;
    }
    if (e.keyCode == 68) { //d
      cameraPos = cameraPos.add($V([10, 0]));
      map.terrain.redraw = true;
    }
    // console.log(e.keyCode);
  };
  idle = function() {
    resources.clear();
    map.update();
    if (map.terrain.redraw) {
      resources.clearTerrain();
      map.drawTerrain(cameraPos);
    }
    map.draw(cameraPos);
    fps += 1;
  };
  window.addEventListener("keydown", doKeyDown, true);

  var loop = function() {
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
