const Resource = require('../resource');

module.exports = class Berries extends Resource {

  initialize() {
    this.pos = $V([200, 100]);
    this.resources = {food: 600};
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
