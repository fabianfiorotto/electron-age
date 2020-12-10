const Building = require('../building');

module.exports = class Wall extends Building {

  getSize() {
    return 1;
  }

  startBuilding() {
    super.startBuilding();
    this.calculateAllModelFrames();
  }

  onEntityCreated() {
    if (this.state == Building.FINISHED) {
      this.calculateAllModelFrames();
    }
  }

  calculateAllModelFrames() {
    var n = this.getNeighbors();
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        if (n[i][j]) {
          var m = n[i][j];
          let frame = m.calculateModelFrame(m.matrixSlice(n, i, j))
          m.setModelFrame(frame);
          if (m.state == Building.INCOMPLETE) {
            m.updateBuildingProcess();
          }
        }
      }
    }
  }

  setModelFrame(frame) {
    //TODO Seria mejor que los modelos tipo wall tengan su propia clase
    // y utilicen la orientacion de la entidad para calcular los frames.
    let models = this.models;
    models.building.frame = frame;
    models.damaged0.frame = frame;
    models.damaged1.frame = frame;
    models.damaged2.frame = frame;
  }

  update() {
  }

  getNeighborsPoints() {
    var size = 5;
    var points = Array.from({length: size}, ()=> new Array(size));

    var y0 = 48 * size / 2 - 24;
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        points[i][j] = this.pos.subtract($V([
          (i - j) * 48,
          (i + j) * 24 - y0
        ]));
      }
    }
    return points;
  }

  getNeighbors() {
    var size = 5;
    var points = this.getNeighborsPoints();
    var neighbors = Array.from({length: size}, ()=> new Array(size).fill(null));

    for (var entity of this.map.entities) {
      for (const [i, row]  of points.entries()) {
        for (const [j, point]  of row.entries()) {
          //TODO: Gates?
          if (entity.pos.eql(point) && entity.constructor === this.constructor && entity.player === this.player) {
            neighbors[i][j] = entity;
          }
        }
      }
    }
    return neighbors;
  }

  matrixSlice(matrix, i, j) {
    return matrix.slice(i-1,i+2).map((a) => a.slice(j-1, j+2));
  }

  calculateModelFrame(neighbors) {
    var code = 0;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (neighbors[i][j]) {
          code |=  2 ** (3 * i + j);
        }
      }
    }

    // Estos valores no tienen sentido pero funcionan
    switch (code) {
      case 0b001010100:
        return 3; //!!       --
      case 0b100010001:
        return 4; //!!       ||
      case 0b000111000:
        return 0; //!!       //
      case 0b010010010:
        return 1; //!!       \\
      default:
        return 2; //       []
    }

  }

  onResourcesLoaded() {
    this.models.building.frame = 2;
  }

  updateBuildingProcess() {
    let model = this.models.marks;
    let {hitPoints, maxHitPoints} = this.properties;
    model.frame = 4 * this.models.building.frame + Math.floor(4 * hitPoints / maxHitPoints)
  }

  getStoneWallModel() {
    if (this.state === Wall.INCOMPLETE) {
      return this.models.marks;
    }
    if (this.state === Wall.DESTROYED) {
      return this.models.debris;
    }
    else if (this.properties.hitPoints / this.properties.maxHitPoints > 0.75) {
      return this.models.building;
    }
    else if (this.properties.hitPoints / this.properties.maxHitPoints > 0.50) {
      return this.models.damaged0;
    }
    else if (this.properties.hitPoints / this.properties.maxHitPoints > 0.25) {
      return this.models.damaged1;
    }
    else {
      return this.models.damaged2;
    }
  }
};
