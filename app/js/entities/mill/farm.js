const Building = require('../building');

module.exports = class Farm extends Building {

  getSize() {
    return 3;
  }

  draw(camera) {
    resources.drawSquare(this.pos.subtract(camera), 96 * this.getSize());
  }

  startBuilding() {
    this.setStage(0);
    super.startBuilding();
  }

  setStage(stage) {
    var tiles;
    var mr = this.map.terrain.mr;
    tiles = this.getTilePoints();
    tiles = tiles.map((tile) => mr.x(tile).map((e) => Math.floor(e)));
    // tiles = this.getTilePoints2();
    for (var tile of tiles) {
      this.map.terrain.setTile(tile.e(1),tile.e(2),'farm_stage_' + stage.toString());
    }
    if (stage == 3) {
      this.resources = {food: 175};
      this.emitter.emit('did-change-resources', this.resources);
    }
  }

  canClick(pos) {
    return this.isAt(pos);
  }

  modelsResources() {
    return {
      sounds: {
        click: 5045
      }
    };
  }

  thumbnail() {
    return 35;
  }

};
