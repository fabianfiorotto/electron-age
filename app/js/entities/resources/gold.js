const Resource = require('../resource');

module.exports = class Stone extends Resource {

  initialize() {
    this.pos = $V([350, 50]);
    this.resources = {gold: 600};
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
        stone: 4479,
      }
    };
  }

  onResourcesLoaded() {
    this.models.stone.randomFrame();
  }

};
