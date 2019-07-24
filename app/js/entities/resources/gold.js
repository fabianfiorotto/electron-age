const Resource = require('../resource');

module.exports = class Stone extends Resource {

  constructor(map, player) {
    super(map, player);
    this.pos = $V([350, 50]);
    this.resources = {stone: 600};
  }

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.pos.subtract(camera), 0, this.getFrame());
      this.models.nuggets.draw(this.pos.subtract(camera), 0, this.frame);
    }
  }

  getModel() {
    return this.models.stone;
  }

  iconsResources() {
    return [{
      interface: 50730,
      frames: {
        thumbnail: 14,
      }
    }];
  }

  modelsResources() {
    return {
      model: {
        stone: 1034,
        nuggets: 2561
      }
    };
  }

  onResourcesLoaded() {
    this.frame = Math.floor(Math.random() * this.models.stone.frames.length);
  }

};
