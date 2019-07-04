const SlpModel = require('./model');

module.exports = class SlpUnitModel extends SlpModel {

  async loadFrames(file){
    await super.loadFrames(file);
    var i, j;

    this.south = [];
    this.southWest = [];
    this.west = [];
    this.northWest = [];
    this.north = [];
    this.northEast = [];
    this.east = [];
    this.southEast = [];

    var framesCount = Math.floor(this.frames.length / 5);
    var extra = 5 - this.frames.length % 5;

    var count = 0;
    for (i = 1; i <= 5 ; i++) {
      var frameSet = this.getFrameSetByNumber(i);
      var fCount = i <= extra ? framesCount : framesCount + 1;
      for (j = count; j < count + fCount ; j++) {
        frameSet.push(this.frames[j]);
      }
      count += fCount;
    }
    for (i = 2; i <= 4 ; i++) {
      var orgSet = this.getFrameSetByNumber(i);
      var destSet = this.getFrameSetByNumber(i+4);
      for (j = 0; j < orgSet.length; j++) {
        var frame = orgSet[j].flip();
        destSet.push(frame);
        this.frames.push(frame);
      }
    }
  }

  getFrameSetByNumber(n) {
    switch (n) {
      case 1:
        return this.south;
      case 2:
        return this.southWest;
      case 3:
        return this.west;
      case 4:
        return this.northWest;
      case 5:
        return this.north;
      case 6:
        return this.northEast;
      case 7:
        return this.east;
      case 8:
        return this.southEast;
    }
  }

  getFrameSetByOrientation(orientation) {
    var pi8 = Math.PI / 8.0;
    if (orientation < - 7 * pi8) {
      return this.west;
    }
    else if (orientation < - 5 * pi8) {
      return this.southWest;
    }
    else if (orientation < - 3 * pi8) {
      return this.south;
    }
    else if (orientation < - pi8) {
      return this.northEast;
    }
    else if (orientation < pi8) {
      return this.east;
    }
    else if (orientation < 3 * pi8) {
      return this.southEast;
    }
    else if (orientation < 5 * pi8) {
      return this.north;
    }
    else if (orientation < 7 * pi8) {
      return this.northWest;
    }
    else {
      return this.west;
    }
  }

  draw(pos, orientation, frame, player) {
    var frameSet = this.getFrameSetByOrientation(orientation);
    frameSet[frame].draw(pos, player);
  }

  nextFrame(n, orientation) {
    var frameSet = this.getFrameSetByOrientation(orientation);
    return n < frameSet.length - 1 ? n + 1 : 0;
  }

};
