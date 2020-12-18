const SlpModel = require('./model');

module.exports = class SlpWallModel extends SlpModel {

  async loadFrames(file) {
    await super.loadFrames(file);
    this.framesCount = Math.floor(this.frames.length / 5);
  }

  draw(pos, orientation, frame, player, ctx) {
    frame = this.framesCount * orientation + frame;
    if (this.frames[frame]) {
      this.frames[frame].draw(pos, player, ctx);
    }
  }

  canClick(pos, orientation, frame) {
    frame = this.framesCount * orientation + frame;
    if (this.frames[frame]) {
      return this.frames[frame].canClick(pos, player, ctx);
    }
    return false;
  }

};
