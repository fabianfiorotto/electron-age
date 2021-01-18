const UIWidget = require('../../ui_widget');

module.exports = class Minimap extends UIWidget {

  template() {
    return 'dashboard/minimap';
  }


  onBind($) {
    this.canvas = $('.minimap-canvas');
    this.ctx = this.canvas.getContext("2d");
  }

  bindMap(map) {
    this.img = this.ctx.createImageData(map.width, map.height);
    let img = this.img;
    let tiles = map.terrain.tiles;
    for (const [i, row] of tiles.entries()) {
      for (const [j, tile] of row.entries()) {
        if (i < 400 && j < 200) {
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

    this.ctx.drawImage(resources.getCanvasFromImg(img), 0, 0, 400, 200);
    console.log(this.canvas.toDataURL());
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
