const Resource = require('../resource');

module.exports = class Tree extends Resource {

  initialize() {
    this.pos = $V([320, 50]);
    this.resources = {wood: 600};
  }

  getModel() {
    if (this.resources.wood < 600) {
      return this.models.chopped;
    }
    else {
      return this.models.tree;
    }
  }

  iconsResources() {
    return [{
      interface: 50730,
      frames: {
        thumbnail: 32,
      }
    }];
  }

  modelsResources() {
    return {
      model: {
        tree: 435,
        chopped: 1252,
        stump: 1035,
      }
    };
  }

  onResourcesLoaded() {
    this.models.tree.randomFrame();
  }

};
