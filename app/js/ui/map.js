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
    this.selection = {
      x1: -2,
      y1: -2,
      x2: -1,
      y2: -1,
      resizing: false,
      click: false,
    }
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

  getSelection() {
    let x1, y1, x2, y2;
    x1 = Math.min(this.selection.x1, this.selection.x2)
    x2 = Math.max(this.selection.x1, this.selection.x2)
    y1 = Math.min(this.selection.y1, this.selection.y2)
    y2 = Math.max(this.selection.y1, this.selection.y2)
    return {
      start: $V([x1, y1]).add(this.cameraPos),
      end: $V([x2, y2]).add(this.cameraPos)
    }
  }

  updateSelectionbox() {
    const style = this.selectbox.style;
    if (this.selection.resizing) {
      let x1, y1, x2, y2;
      var dim = this.entitiesCanvas.getBoundingClientRect();

      x1 = Math.min(this.selection.x1, this.selection.x2)
      x2 = Math.max(this.selection.x1, this.selection.x2)
      y1 = Math.min(this.selection.y1, this.selection.y2)
      y2 = Math.max(this.selection.y1, this.selection.y2)

      style.left = x1 + 'px';
      style.top = y1 + 'px';
      style.right = (dim.width - x2) + 'px';
      style.bottom = (dim.height - y2) + 'px';
      style.display = '';
    }
    else {
      style.display = 'none';
    }
  }

  documentReady() {
    this.element = document.getElementById("map");

    this.entitiesCanvas = document.getElementById("entitiesCanvas");
    this.terrainCanvas = document.getElementById("terrainCanvas");

    this.selectbox = document.getElementById("selectbox");

    this.element.addEventListener('mousemove', (e) => {
      this.map.over(this.eventCoords(e));
      if (this.selection.click) {
        this.selection.x2 = e.clientX;
        this.selection.y2 = e.clientY;
        this.selection.resizing = true;
      }
      this.updateSelectionbox();
    });

    this.element.addEventListener('mousedown', (e) => {
      if (e.which == 1) {
        this.selection.x1 = e.clientX;
        this.selection.y1 = e.clientY;
        this.selection.click = true;
      }
    });

    this.element.addEventListener('mouseup', (e) => {
      if (e.which == 1) {
        let v = this.eventCoords(e);
        this.map.mouseUp(v);
        if (this.selection.resizing) {
          this.map.selectEntites(this.getSelection());
        }
        else {
          this.map.leftClick(v);
        }
        this.selection.resizing = false;
        this.selection.click = false;
        this.updateSelectionbox();
      }
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
      this.moveCamera($V([0,-10]));
    }
    if (e.keyCode == 65) { //a
      this.moveCamera($V([-10, 0]));
    }
    if (e.keyCode == 83) { //s
      this.moveCamera($V([0, 10]));
    }
    if (e.keyCode == 68) { //d
      this.moveCamera($V([10, 0]));
    }
    // console.log(e.keyCode);
  };

  moveCamera(v) {
    this.cameraPos = this.cameraPos.add(v);
    this.refreshMap();
  }

  refreshMap() {
    this.map.terrain.redraw = true;
    resources.drawRefresh();
  }

  resizeMap() {
    this.entitiesCanvas.setAttribute('width', window.innerWidth);
    this.terrainCanvas.setAttribute('width', window.innerWidth);
    this.entitiesCanvas.setAttribute('height', window.innerHeight);
    this.terrainCanvas.setAttribute('height', window.innerHeight);

    this.element.style.height = window.innerHeight + "px";

    this.refreshMap();
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
