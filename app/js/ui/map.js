const AoeMap = require('../map');
const ScxMapBuilder = require('../scx/scx');
const TestBuilder = require('../test/testmap');

const TopBar = require('./topbar');
const Dashboard = require('./dashboard');

module.exports = class MapView {

  constructor() {
    this.map = new AoeMap(120, 120); //No puedo dejar la variable map vacia!!
    this.cameraPos = $V([0, 0]);
    this.topBar = new TopBar();
    this.dashboard = new Dashboard();
  }

  async loadMapScx(filename) {
    var file = await fs.open(filename, "r");
    // var file = await fs.open('/home/fabian/github/aldeano.scx', "r");
    // var file = await fs.open('/home/fabian/github/test1.scx', "r");
    // var file = await fs.open('/home/fabian/github/agua.scx', "r");
    // var file = await fs.open('/home/fabian/github/paredes.scx', "r");
    // var file = await fs.open('/home/fabian/github/edificios.scx', "r");
    var map = await ScxMapBuilder.load(file);
    this.loadMap(map);
    return map;
  };

  async loadTestMap() {
    let map = await TestBuilder.loadTestMap();
    this.loadMap(map);
    return map;
  };

  loadMap(map) {
    this.map = map;
    this.cameraPos = map.initCameraPos;

    this.topBar.bind(map, 'top-bar');
    this.dashboard.bind(map, 'dashboard');
  }

  eventCoords(e) {
    var dim = e.target.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;
    return $V([x, y]).add(this.cameraPos);
  }

  windowEventCoords(e) {
    var dim = this.entitiesCanvas.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;

    if (x >= 0 && y >=0 && x <= dim.width && y <= dim.height) {
      return $V([x, y]).add(this.cameraPos);
    }
    return NULL;
  }

  documentReady() {
    this.element = document.getElementById("map");

    this.entitiesCanvas = document.getElementById("entitiesCanvas");
    this.terrainCanvas = document.getElementById("terrainCanvas");

    this.element.addEventListener('mousemove', (e) => {
      this.map.over(this.eventCoords(e));
    });

    this.element.addEventListener('mousedown', (e) => {
      if (e.which == 1) {
        this.map.mouseDown(this.eventCoords(e));
      }
    });

    this.element.addEventListener('mouseup', (e) => {
      if (e.which == 1) {
        this.map.mouseUp(this.eventCoords(e));
      }
    });

    this.element.addEventListener('click', (e) => {
      this.map.leftClick(this.eventCoords(e));
    });

    window.addEventListener('contextmenu',(e) => {
      let v = this.windowEventCoords(e);
      if (v) this.map.rightClick(v);
    });

    window.addEventListener("keydown", (e) => mapView.doKeyDown(e), true);
    window.addEventListener('resize', () => this.resizeMap());

    this.resizeMap();
  }

  doKeyDown(e) {
    if (e.keyCode == 87) { //w
      this.cameraPos = this.cameraPos.add($V([0,-10]));
      this.map.terrain.redraw = true;
    }
    if (e.keyCode == 65) { //a
      this.cameraPos = this.cameraPos.add($V([-10, 0]));
      this.map.terrain.redraw = true;
    }
    if (e.keyCode == 83) { //s
      this.cameraPos = this.cameraPos.add($V([0, 10]));
      this.map.terrain.redraw = true;
    }
    if (e.keyCode == 68) { //d
      this.cameraPos = this.cameraPos.add($V([10, 0]));
      this.map.terrain.redraw = true;
    }
    // console.log(e.keyCode);
  };

  resizeMap() {
    this.entitiesCanvas.setAttribute('width', window.innerWidth);
    this.terrainCanvas.setAttribute('width', window.innerWidth);
    this.entitiesCanvas.setAttribute('height', window.innerHeight);
    this.terrainCanvas.setAttribute('height', window.innerHeight);

    this.element.style.height = window.innerHeight + "px";

    this.map.terrain.redraw = true;
    resources.drawRefresh();
  };

  draw() {
    resources.clear();
    this.map.update();
    if (this.map.terrain.redraw) {
      resources.clearTerrain();
      this.map.drawTerrain(this.cameraPos);
    }
    this.map.draw(this.cameraPos);
    resources.drawCompleted();
  }

}
