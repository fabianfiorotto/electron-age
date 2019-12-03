const Building = require('../building');

module.exports = class Wall extends Building {

  getSize() {
    return 1;
  }

  onEntityCreated() {
    var n = this.getNeighbors();
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        if (n[i][j]) {
          var m = n[i][j];
          m.modelFrame = m.calculateModelFrame(m.matrixSlice(n, i, j));
          if (m.modelFrame == 3) {
            console.log("aca");
          }
        }
      }
    }
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

};
