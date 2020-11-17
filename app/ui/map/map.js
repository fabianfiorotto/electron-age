const AoeMap = require('../../js/map');
const ScxMapBuilder = require('../../js/scx/scx');
const TestBuilder = require('../../js/test/testmap');

const LoadingScreen = require('../loading/loading');
const TopBar = require('../topbar/topbar');
const Dashboard = require('../dashboard/dashboard');

const UIWidget = require('../ui_widget');

module.exports = class MapView extends UIWidget {

  constructor() {
    super();
    this.map = new AoeMap(120, 120); //No puedo dejar la variable map vacia!!
    this.cameraPos = $V([0, 0]);
    this.topBar = new TopBar();
    this.dashboard = new Dashboard();
    this.loading = new LoadingScreen();
    this.selection = {
      resizing: false,
      click: false,
    }
  }

  async loadMapScx(filename) {
    this.loading.start();
    var file = await fs.open(filename, "r");
    var map = await ScxMapBuilder.load(file, (v, t) => this.loading.progress(v, t));
    file.close();
    this.bindMap(map);
    this.loading.complete();
    return map;
  };

  async loadTestMap() {
    this.loading.start();
    let map = await TestBuilder.loadTestMap((v, t) => this.loading.progress(v, t));
    this.bindMap(map);
    this.loading.complete();
    return map;
  };

  bindMap(map) {
    this.map = map;
    this.cameraPos = map.initCameraPos;

    this.topBar.bindMap(map);
    this.dashboard.bindMap(map);

    this.player = map.players[1];

    this.player.onEntityMoved((entity) => {
      this.player.updateSeight();
    });
    this.player.updateSeight();
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

  template() {
    return 'map';
  }

  onBind($) {
    this.entitiesCanvas = $("#entitiesCanvas");
    this.terrainCanvas = $("#terrainCanvas");
    this.fogCanvas = $("#fogCanvas");
    this.selectbox = $("#selectbox");

    this.topBar.bind('top-bar');
    this.dashboard.bind('dashboard');
    this.loading.bind('loading-screen');

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
    this.player?.updateSeight();
    this.map.terrain.redraw = true;
    resources.drawRefresh();
  }

  resizeMapCanvas(canvas) {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
  }

  resizeMap() {
    this.resizeMapCanvas(this.entitiesCanvas);
    this.resizeMapCanvas(this.terrainCanvas);
    this.resizeMapCanvas(this.fogCanvas);

    this.element.style.height = window.innerHeight + "px";

    this.refreshMap();
  };

  draw() {
    resources.clear();
    this.map.update();
    let redraw = this.map.terrain.redraw;
    if (redraw) {
      resources.clearTerrain();
      this.map.drawTerrain(this.cameraPos, this.player);
    }
    if (resources.config.fogofwar) {
      this.player?.drawLineOfSeight(this.cameraPos, redraw);
    }
    this.map.draw(this.cameraPos);
    resources.drawCompleted();
  }

  async loadResources(res) {
    let palette = await resources.loadPalette(50505);

    var model = await res.loadInterface(51000);
    model.load({
      base: palette,
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.element.style.cursor = 'url(' + res.getUrl(img) +'), auto';
  }
}
