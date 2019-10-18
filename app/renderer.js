const ResourceManager = require("./resources");
const AoeMap = require('./js/map');
const TestBuilder = require('./js/test/testmap');

const TopBar = require('./js/ui/topbar');
const Dashboard = require('./js/ui/dashboard');

var topBar = new TopBar();
var dashboard = new Dashboard();

require("sylvester");
const fs = require('fs');

window.resources = new ResourceManager();
var map;
var cameraPos = $V([0, 0]);
var cameraMoved = true;
var fps = 0;

document.addEventListener("DOMContentLoaded", function() {
  var c, ctx, tr_c, tr_ctx, doKeyDown, idle, imgs;

  var showFps = document.getElementById("fps");
  var mapDiv = document.getElementById("map");

  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");

  tr_c = document.getElementById("terrainCanvas");
  tr_ctx = tr_c.getContext("2d");

  //map = new AoeMap(120, 120);
  map = TestBuilder.loadTestMap();
  map.loadResources(resources).then(() => cameraMoved = true);

  topBar.bind(map, 'top-bar');
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

  var resizeMap = function() {
    c.setAttribute('width', window.innerWidth);
    tr_c.setAttribute('width', window.innerWidth);
    c.setAttribute('height', window.innerHeight - 250);
    tr_c.setAttribute('height', window.innerHeight - 250);
    mapDiv.style.height = (window.innerHeight - 250) + "px";
    cameraMoved = true;
  };

  window.addEventListener('resize',function(e) {
    resizeMap();
  });
  resizeMap();

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
      // tr_ctx.clearRect(0, 0, tr_c.width, tr_c.height);
      tr_ctx.beginPath();
      tr_ctx.rect(0, 0, tr_c.width, tr_c.height);
      tr_ctx.fillStyle = "#000";
      tr_ctx.fill();
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

  loop();

  return 1;
});
