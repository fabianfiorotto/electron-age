const Entity = require('../entity');

module.exports = class Stone extends Entity {

  constructor(map, player) {
    super(map, player);
    this.pos = $V([260, 50]);
    this.resources = {stone: 600};
  }

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.pos.subtract(camera), 0, this.frame);
    }
  }

  getModel() {
    return this.models.stone;
  }

  iconsResources() {
    return [{
      interface: 50730,
      frames: {
        thumbnail: 9,
      }
    }];
  }

  modelsResources() {
    return {
      model: {
        stone: 1034
      }
    };
  }

  onResourcesLoaded() {
    this.frame = Math.floor(Math.random() * this.models.stone.frames.length);
  }

};
