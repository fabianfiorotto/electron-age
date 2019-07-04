const ResourceManager = require("./resources");
const AoeMap = require('./js/map');
const Controls = require('./js/ui/controls');
const EntityInfo = require('./js/ui/entity_info');
const ViewResources = require('./js/ui/resources');

var controls = new Controls();
var info = new EntityInfo();
var viewResources = new ViewResources();

require("sylvester");
const fs = require('fs');

window.resources = new ResourceManager();
var map = new AoeMap(120, 120);
var cameraPos = $V([0, 0]);
var cameraMoved = true;
var fps = 0;

var loadSlpImgs = async function(root) {
  var imgs = root.getElementsByClassName('slp-image');
  for (var i = 0; i < imgs.length; i++) {
    var src = imgs[i].getAttribute('src');
    var [id, frame] = src.split('/');
    var m = await resources.loadInterface(id.substr(1));
    m.load({
      base: resources.palettes[50505],
      player: 0
    });
    imgs[i].setAttribute('src', m.frames[frame || 0].getUrl());
  }
};

var bindWidget = function(widget, name, elementName) {
  fs.readFile('./app/js/ui/' + name + '.html', (err, data) => {
    if (err) {
      console.log(err);
    }
    var element = document.getElementById(elementName);
    element.innerHTML = data;
    loadSlpImgs(element);
    widget.bind(element, map);
  });
};

document.addEventListener("DOMContentLoaded", function() {
  var c, ctx, tr_c, tr_ctx, doKeyDown, idle, imgs;

  var showFps = document.getElementById("fps");

  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");

  tr_c = document.getElementById("terrainCanvas");
  tr_ctx = tr_c.getContext("2d");

  loadSlpImgs(document);

  map.loadResources(resources).then(() => cameraMoved = true);

  controls.loadResources(resources);
  controls.bind(map);

  bindWidget(info, 'entity_info', 'entity-info');
  bindWidget(viewResources, 'resources', 'resources');

  c.addEventListener('mousemove', (e) => {
    var dim = e.target.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;

    var v = $V([x, y]).add(cameraPos);

    map.over(v);
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
