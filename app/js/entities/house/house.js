const Building = require('../building');

module.exports = class House extends Building {

  thumbnail() {
    return 34;
  }

  getSize() {
    return 2;
  }

  defineProperties() {
    return {
      constructionTime: 25,
      hitPoints: 550,
      meleeArmor: 0,
      pierceArmor: 7,
      population: 5,
      lineofSeight: 2,
    };
  }

  modelsResources() {
    return {
      model: {
        building: 2223
      },
      sounds: {
        click: 5463
      }
    };
  }

  drawMemory(camera, ctx) {

    var model = this.getModel();
    var pos = this.pos.subtract(camera);

    let [x, y] = pos.elements;
    let img = model.frames[0].imgs[this.player.id];
    // if (!resources.simple.isOut(ctx.canvas, img, x, y)) {
    //   console.log(camera);
    // }

    if (model) {
      model.draw(pos, 0, this.getFrame(), this.player.id, ctx);
    }
  }

  onResourcesLoaded() {
    this.modelFrame = Math.floor(Math.random() * this.models.building.frames.length);
  }

};
