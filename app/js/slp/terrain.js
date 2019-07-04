var SlpModel = require('./model');

module.exports = class SlpTerrainModel extends SlpModel {

  async loadFrames(file) {
    await super.loadFrames(file);
    this.tc = Math.floor(Math.sqrt(this.frames.length));
  }

  draw(pos, orientation, frame) {
    for (var i = 0; i < this.tc; i++) {
      for (var j = 0; j < this.tc; j++) {
        this.drawTerrain(i, j, pos);
      }
    }
  }

  drawTerrain(x, y, pos) {
    var frame_id = (y % this.tc) + ((x % this.tc) * this.tc);
    var f = this.frames[frame_id];
    var w = f.width - 1, h = f.height - 1;
    var cell = $V([
      (x + y) * w / 2,
      (x - y) * h / 2
    ]);
    f.draw(pos.add(cell));
  }

  nextFrame(n, orientation) {
    return 0;
  }

};
