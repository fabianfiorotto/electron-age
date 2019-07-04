const SlpModel = require('./model');

module.exports = class SlpProjectileModel extends SlpModel {

  async loadFrames(file){
    await super.loadFrames(file);
    var size = this.frames.length - 1;
    for (var i = 1; i < size; i++) {
      this.frames.push(this.frames[i].flip());
    }
  }

  getFrameNumberByOrientation(orientation) {
    var ori;
    if (orientation < - Math.PI / 2) {
      ori =  - orientation -  Math.PI / 2;
    }
    else {
      ori = - orientation + 3 * Math.PI / 2;
    }
    return Math.round(ori * this.frames.length / ( 2 * Math.PI ));
  }

  draw(pos, orientation, frame, player) {
    var index = this.getFrameNumberByOrientation(orientation);
    this.frames[index].draw(pos, player);
  }

  nextFrame(n, orientation) {
    return n;
  }

};
