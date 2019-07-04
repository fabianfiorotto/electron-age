const Entity = require('../entity');

module.exports = class Berries extends Entity {

  constructor(map, player) {
    super(map, player);
    this.pos = $V([200, 100]);
    this.resources = {food: 600};
  }

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.pos.subtract(camera), 0, this.getFrame());
    }
  }

  getModel() {
    return this.models.berries;
  }

  iconsResources() {
    return [{
      interface: 50730,
      frames: {
        thumbnail: 6,
      }
    }];
  }

  modelsResources() {
    return {
      model: {
        berries: 2560
      }
    };
  }

  onResourcesLoaded() {
    this.frame = Math.floor(Math.random() * this.models.berries.frames.length);
  }

};
