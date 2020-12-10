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

    this.cursors = {};
    this.overEntity = null;
    this.viewSize = resources.config.viewSize;
    this.translating = null;
    this.translate = $V([0, 0]);
  }

  async loadMapScx(filename) {
    this.loading.start();
    var file = await fs.open(filename, "r");
    var map = await ScxMapBuilder.load(file, (v, t) => this.loading.progress(v, t));
    file.close();
    this.triggerMapLoaddedEvent(map);
    this.loading.complete();
    return map;
  };

  async loadTestMap() {
    this.loading.start();
    let map = await TestBuilder.loadTestMap((v, t) => this.loading.progress(v, t));
    this.triggerMapLoaddedEvent(map);
    this.loading.complete();
    return map;
  };

  triggerMapLoaddedEvent(map) {
    var event = new CustomEvent('mapLoaded');
    event.map = map;
    document.dispatchEvent(event);
  }


  bindMap(map) {
    this.map = map;
    this.cameraPos = map.initCameraPos.subtract($V([
      (this.viewSize - 1) * window.innerWidth  / 2,
      (this.viewSize - 1) * window.innerHeight / 2,
    ]));

    this.player = map.players[1];

    this.player.onEntityMoved((entity) => {
      this.player.updateSeight();
    });
    this.player.updateSeight();
  }

  setOverEntity(entity) {
    if (this.map.selected.length && entity) {
      let selected = this.map.selected[0];
      let name = selected.getCursorFor(entity);
      this.setCursor(name);
    }
    else {
      this.setCursor('default');
    }

    this.overEntity = entity;
  }

  eventCoords(e) {
    var dim = e.target.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;
    return $V([x, y]).add(this.cameraPos);
  }

  windowEventCoords(e) {
    var dim = this.inner.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;

    if (x >= 0 && y >=0 && x <= dim.width && y <= dim.height) {
      return $V([x, y]).add(this.cameraPos).add(this.translate);
    }
    return NULL;
  }

  getSelection() {
    let x1, y1, x2, y2;
    const [tx, ty] = this.translate.elements;
    x1 = Math.min(this.selection.x1, this.selection.x2) + tx;
    x2 = Math.max(this.selection.x1, this.selection.x2) + tx;
    y1 = Math.min(this.selection.y1, this.selection.y2) + ty;
    y2 = Math.max(this.selection.y1, this.selection.y2) + ty;
    return {
      start: $V([x1, y1]).add(this.cameraPos),
      end: $V([x2, y2]).add(this.cameraPos)
    }
  }

  updateSelectionbox() {
    const style = this.selectbox.style;
    if (this.selection.resizing) {
      let x1, y1, x2, y2;
      var dim = this.inner.getBoundingClientRect();

      x1 = Math.min(this.selection.x1, this.selection.x2);
      x2 = Math.max(this.selection.x1, this.selection.x2);
      y1 = Math.min(this.selection.y1, this.selection.y2);
      y2 = Math.max(this.selection.y1, this.selection.y2);

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
    this.inner = $("#map-inner");
    this.wrapper = $(".canvas-wrapper");
    this.selectbox = $("#selectbox");

    this.topBar.bind('top-bar');
    this.dashboard.bind('dashboard');
    this.loading.bind('loading-screen');

    this.inner.addEventListener('mousemove', (e) => {
      let coords = this.eventCoords(e);
      this.map.over(coords);
      let entity = this.map.clickEntity(coords);
      if (entity != this.overEntity) {
        this.setOverEntity(entity);
      }
      if (this.selection.click) {
        this.selection.x2 = e.clientX;
        this.selection.y2 = e.clientY;
        this.selection.resizing = true;
      }
      this.updateSelectionbox();
    });

    this.inner.addEventListener('mousedown', (e) => {
      if (e.which == 1) {
        this.selection.x1 = e.clientX;
        this.selection.y1 = e.clientY;
        this.selection.click = true;
      }
    });

    this.inner.addEventListener('mouseup', (e) => {
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

    this.inner.addEventListener('mousemove', (e) => {
      if (e.clientX < 20) {
        this.translating = $V([-5, 0]);
      }
      else if (e.clientX > this.inner.offsetWidth - 20) {
        this.translating = $V([5, 0]);
      }
      else if (e.clientY < 50) {
        this.translating = $V([0,-5]);
      }
      else if (e.clientY > this.inner.offsetHeight - 240) {
        this.translating = $V([0, 5]);
      }
      else {
        this.translating = null
      }
    });
    this.inner.addEventListener('mouseout', (e) => {
      this.translating = null
    });
    window.addEventListener("keydown", (e) => mapView.doKeyDown(e), true);
    window.addEventListener('resize', () => this.resizeMap());

    this.resizeMap();
    let xx = (this.viewSize - 1) / 2;
    this.translateTo($V([window.innerWidth * xx, window.innerHeight * xx]));
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


  translateTo(v) {
    if (this.viewSize <= 1){
      return;
    }
    this.translate = this.translate.add(v);
    let [x,y] = this.translate.elements;
    let xx = (this.viewSize - 1) / 2;
    if (x < 0 || x > (this.viewSize - 1) * window.innerWidth) {
      let sg = x < 0 ? -1 : 1;
      x = window.innerWidth * xx;
      this.moveCamera($V([sg * x, 0]));
      this.translate = $V([x, y]);
    }
    if (y < 0 || y > (this.viewSize - 1) * window.innerHeight) {
      let sg = y < 0 ? -1 : 1;
      y = window.innerHeight * xx;
      this.moveCamera($V([0, sg * y]));
      this.translate = $V([x, y]);
    }

    this.wrapper.style.transform = `translate(${-x}px, ${-y}px)`;
  }

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
    canvas.setAttribute('width', window.innerWidth * this.viewSize);
    canvas.setAttribute('height', window.innerHeight * this.viewSize);
  }

  resizeMap() {
    for (let canvas of this.wrapper.children) {
      this.resizeMapCanvas(canvas);
    }

    this.refreshMap();
  };

  draw() {
    if (this.translating) {
      this.translateTo(this.translating);
    }
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

  setCursor(name) {
    this.element.style.cursor = 'url(' + resources.getUrl(this.cursors[name]) +'), auto';
  }

  async loadResources(res) {
    let palette = await resources.loadPalette(50505);

    var model = await res.loadInterface(51000);
    model.load({
      base: palette,
      player: 0
    });
    this.cursors.default = model.frames[0].imgs[0];
    this.cursors.pointer = model.frames[3].imgs[0];
    this.cursors.attack = model.frames[4].imgs[0];
    this.cursors.convert = model.frames[5].imgs[0];
    this.setCursor('default')
  }
}
