const UIWidget = require('../../ui_widget');
const Terrain = require('../../../js/terrain/terrain');

module.exports = class Minimap extends UIWidget {

  static WIDTH = 400;
  static HEIGHT = 200;

  template() {
    return 'dashboard/minimap';
  }


  eventCoords(e) {
    var dim = e.target.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top - Minimap.HEIGHT / 2;

    let w = this.map.width * Terrain.TILE_WIDTH
    let h = this.map.height * Terrain.TILE_HEIGHT

    return $V([
      x * w / Minimap.WIDTH,
      y * h / Minimap.HEIGHT
    ]);
  }

  onBind($) {
    this.canvas = $('.minimap-canvas');
    this.ctx = this.canvas.getContext("2d");

    this.canvas.addEventListener('click', (e) => {
      let pos = this.eventCoords(e);
      mapView.setCamera(pos);
    });
  }

  bindMap(map) {

    let e = mapView.cameraPos.elements;
    console.log(e[0], e[1]);

    this.map = map;
    this.img = this.ctx.createImageData(map.width, map.height);

    this.draw();
    setInterval(()=> this.draw(), 10000);
  }

  draw() {
    let map = this.map
    let img = this.img;
    let tiles = map.terrain.tiles;
    for (const [i, row] of tiles.entries()) {
      for (const [j, tile] of row.entries()) {
        if (i < Minimap.WIDTH && j < Minimap.HEIGHT) {
          let color = tile.terrain.minimap;
          this.printPixel(img, i, j, color);
        }
      }
    }

    for (let entity of map.entities) {
      let pos = map.terrain.mr.x(entity.pos).map(e=>Math.round(e));
      let [i, j] = pos.elements;
      let color = entity.getMinimapColor();
      this.printPixel(img, i, j, color);
    }

    if (resources.config.fogofwar) {
      mapView.player?.minimapDrawLineOfSeight(img);
    }

    this.ctx.drawImage(resources.getCanvasFromImg(img), 0, 0, Minimap.WIDTH, Minimap.HEIGHT);
  }


  printPixel(img, i, j, color) {
    let x =  0.5 * i + 0.5 * j;
    let y =  0.5 * i - 0.5 * j + img.height / 2;
    let des = Math.floor(x) + img.width * Math.floor(y);

    img.data[4 * des + 0] = parseInt(color.slice(1,3), 16);
    img.data[4 * des + 1] = parseInt(color.slice(3,5), 16);
    img.data[4 * des + 2] = parseInt(color.slice(5,7), 16);
    img.data[4 * des + 3] = 255;
  }

}
