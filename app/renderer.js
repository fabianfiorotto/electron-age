const ResourceManager = require("./resources");
const AoeMap = require('./js/map');

const ViewResources = require('./js/ui/resources');
const Dashboard = require('./js/ui/dashboard');

var viewResources = new ViewResources();
var dashboard = new Dashboard();

require("sylvester");
const fs = require('fs');

window.resources = new ResourceManager();
var map = new AoeMap(120, 120);
var cameraPos = $V([0, 0]);
var cameraMoved = true;
var fps = 0;

document.addEventListener("DOMContentLoaded", function() {
  var c, ctx, tr_c, tr_ctx, doKeyDown, idle, imgs;

  var showFps = document.getElementById("fps");

  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");

  tr_c = document.getElementById("terrainCanvas");
  tr_ctx = tr_c.getContext("2d");

  map.loadResources(resources).then(() => cameraMoved = true);

  viewResources.bind(map, 'resources');
  dashboard.bind(map, 'dashboard');

  c.addEventListener('mousemove', (e) => {
    var dim = e.target.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;

    var v = $V([x, y]).add(cameraPos);

    map.over(v);
  });

  c.addEventListener('mousedown', (e) => {
    if (e.which == 1) {
      var dim = e.target.getBoundingClientRect();
      var x = e.clientX - dim.left;
      var y = e.clientY - dim.top;

      var v = $V([x, y]).add(cameraPos);
      map.mouseDown(v);
    }
  });

  c.addEventListener('mouseup', (e) => {
    if (e.which == 1) {
      var dim = e.target.getBoundingClientRect();
      var x = e.clientX - dim.left;
      var y = e.clientY - dim.top;

      var v = $V([x, y]).add(cameraPos);
      map.mouseUp(v);
    }
  });


  c.addEventListener('click', (e) => {
    var dim = e.target.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;

    var v = $V([x, y]).add(cameraPos);
    map.leftClick(v);
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

  doKeyDown = function(e) {
    if (e.keyCode == 87) { //w
      cameraPos = cameraPos.add($V([0,-10]));
      cameraMoved = true;
    }
    if (e.keyCode == 65) { //a
      cameraPos = cameraPos.add($V([-10, 0]));
      cameraMoved = true;
    }
    if (e.keyCode == 83) { //s
      cameraPos = cameraPos.add($V([0, 10]));
      cameraMoved = true;
    }
    if (e.keyCode == 68) { //d
      cameraPos = cameraPos.add($V([10, 0]));
      cameraMoved = true;
    }
    // console.log(e.keyCode);
  };
  idle = function() {
    ctx.clearRect(0, 0, c.width, c.height);
    map.update();
    if (cameraMoved) {
      tr_ctx.clearRect(0, 0, tr_c.width, tr_c.height);
      map.drawTerrain(cameraPos);
      cameraMoved = false;
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

  // Si le pongo menos de 60 el proceso de dibujado del terreno tarde demaciado
  // y bloquea los procesos de carga de recursos.
  // La solucion seria que el proceso de dibujado sea asincronico
  // setInterval(idle, 60);
  loop();

  return 1;
});
