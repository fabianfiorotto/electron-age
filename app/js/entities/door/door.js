const Building = require('../building');
const Terrain = require('../../terrain/terrain');

module.exports = class Door extends Building {


  initialize() {
    this.orientation = 1;
    this.open = false;
  }

  thumbnail() {
    return 36;
  }


  getSize() {
    return 4; //??
  }


  controlsIcons() {
    return {
      turn: 36, //TODO remove DEBUG only
      raiseGate: 47,
      shutGate: 48,
    };
  }

  defineDashboardControls() {
    if (this.open) {
      return {
        main: ["shutGate", "turn"]
      };
    }
    else {
      return {
        main: ["raiseGate", "turn"]
      };
    }
  }

  raise() {
    this.open = true;
  }

  shut() {
    this.open = false
  }

  defineControls() {
    var icons = this.icons;
    return {
      raiseGate: {
        icon: icons.raiseGate,
        callback: () => this.raise(),
      },
      shutGate: {
        icon: icons.shutGate,
        callback: () => this.shut(),
      },
      turn: {
        icon: icons.turn,
        callback: () => this.setOrientation(this.orientation > 3 ? 0 : this.orientation + 1),
      }
    }
  }

  setOrientation(orientation) {
    let w = Terrain.TILE_WIDTH;
    let h = Terrain.TILE_HEIGHT
    switch (orientation) {
      case 1:
        this.models.leftWall.pos = $V([-1.5 * w, 0]);
        this.models.rightWall.pos = $V([1.5 * w, 0]);
        break;
      case 2:
        this.models.leftWall.pos = $V([-0.75 * w, -0.75 * h]);
        this.models.rightWall.pos = $V([0.75 * w, 0.75 * h]);
        break;
      case 3:
        this.models.leftWall.pos = $V([-0.75 * w, 0.75 * h]);
        this.models.rightWall.pos = $V([0.75 * w, -0.75 * h]);
        break;
      case 4:
      this.models.leftWall.pos = $V([0, -1.5 * h]);
      this.models.rightWall.pos = $V([0, 1.5 * h]);
        break;
    }

    this.orientation = orientation;
  }

  updateBuildingProcess() {
    let {hitPoints, maxHitPoints} = this.properties;
    this.models.marks1.progressFrame(hitPoints / maxHitPoints);
  }

  onResourcesLoaded() {
    this.models.leftWall.frame = 2;
    this.models.rightWall.frame = 2;

    this.setOrientation(this.orientation);
  }

  getModel() {
    let o = this.orientation;
    if (this.state === Building.INCOMPLETE) {
      return this.models['marks' + o];
    }
    if (this.state === Building.DESTROYED) {
      return this.models.debris;
    }
    else if (this.open){
      return this.models['open' + o];
    }
    else {
      return this.models['closed' + o];
    }
  }

  draw(camera) {
    this.getModel()?.draw(camera);
    if (this.state === Building.FINISHED || this.state === Building.IMAGINARY) {
      this.models.leftWall?.draw(camera);
      this.models.rightWall?.draw(camera);
    }
    if (this.state === Building.FINISHED) {
      this.getFlames()?.draw(camera);
    }
  }

  canClick(pos) {
    const building = this.getModel();
    const {leftWall, rightWall} = this.models;
    if (this.state === Building.INCOMPLETE) {
      return this.isAt(pos);
    }
    else if (leftWall && rightWall && building) {
      return building.canClick(pos)
        || leftWall.canClick(pos)
        || rightWall.canClick(pos);
    }
    else {
      return false;
    }
  }

  _validateTile(i, j) {
    // Agregar una funcion que dependiendo de la orientacion descarte tiles.
    switch (this.orientation) {
      case 1:
        return i + j == 3;
      case 2:
        return j == 1;
      case 3:
        return i == 1;
      case 4:
        return i == j;
    }
    return true;
  }


  getTilePoints() {
    var s = this.getSize();
    var points = [];
    for (var i = 0; i < s; i++) {
      for (var j = 0; j < s; j++) {
        if (this._validateTile(i,j)) {
          points.push(this.pos.subtract($V([
            48 * (i - j),
            24 * (i + j - Math.floor(s / 2))
          ])));
        }
      }
    }
    return points;
  }

}
