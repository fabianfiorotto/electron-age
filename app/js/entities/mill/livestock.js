const Unit = require('../unit');

module.exports = class Livestock extends Unit {

  constructor(map, player) {
    super(map, player);
    this.resources = {food: this.providesFood()};
    this.butchered = false;
    this.onDidChangeResources((res) => {
      if (!res.food) {
        this.setState(Unit.ROTTING);
      }
    });
  }

  nextFrame() {
    var next = super.nextFrame();
    if (this.state == Unit.DYING && this.resources.food) {
      return next < this.frame ? this.frame : next;
    }
    else {
      return next;
    }
  }

  defineTypes() {
    return [EntityType.LIVESTOCK];
  }

  onDied() {
    if (!this.butchered || this.resources.food == 0) {
      this.setState(Unit.ROTTING);
    }
  }

  providesFood() {
    return 1;
  }
};
