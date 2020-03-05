const SlpModel = require('./model');

module.exports = class SlpProjectileModel extends SlpModel {

  async loadFrames(file){
    await super.loadFrames(file);
    var size = this.frames.length - 1;
    var frames = [];
    for (var i = 1; i < size; i++) {
      frames.push(this.frames[i].flip());
    }
    var frames1 = frames.slice(Math.floor(frames.length/2), frames.length);
    var frames2 = this.frames.reverse();
    var frames3 = frames.slice(0, Math.floor(frames.length/2));

    this.frames = frames1.concat(frames2,frames3);
  }

  getFrameNumberByOrientation(orientation) {
    if (orientation < 0) {
      orientation = 2 * Math.PI + orientation;
    }
    return Math.floor(orientation * 36 / Math.PI);
  }

  draw(pos, orientation, frame, player) {
    var index = this.getFrameNumberByOrientation(orientation);
    if (this.frames[index]) {
      this.frames[index].draw(pos, player);
    }
    else {
      console.log([orientation, index]);
    }
  }

  nextFrame(n, orientation) {
    return n;
  }

};
