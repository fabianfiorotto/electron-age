const Resource = require('../resource');

module.exports = class Stone extends Resource {

  constructor(map, player) {
    super(map, player);
    this.pos = $V([260, 50]);
    this.resources = {stone: 600};
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
