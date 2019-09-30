module.exports = class PathFinder {

  constructor(map) {
    this.map = map;
    this.enabled = true;
  }

  find(pos1, pos2) {
    if (!this.enabled) {
      return [pos2]; // DEBUG ONLY!
    }
    if (!this.map.areThereAnyObstacle(pos1, pos2)) {
      return [pos2];
    }

    var node = {
      dist: 0,
      pos: pos1,
      parent: null,
    };

    var visited = [node];

    // Esto solo sirve para detener la recursividad.
    // No es necesario explorar todas las posibilidades
    var best = {
      dist: null,
    };

    var result = this.findRecursive(node, pos2, visited, best);

    if (result === null) {
      return [];
    }

    var path = [pos2];
    var last = pos2;

    while (result) {
      if (this.map.areThereAnyObstacle(result.pos, last)) {
        path.push(last);
        last = result.pos;
        if (!last.parent) {
          path.push(last);
        }
      }

      result = result.parent;
    }
    path.reverse();
    return path;
  }

  findRecursive(node, target, visited, best) {
    var next = this.nextSteps(node, target, visited, best);

    var results = [];

    for (const n of next) {
      visited.push(n);

      if (!this.map.areThereAnyObstacle(n.pos, target)) {
        if (best.dist === null || best.dist > n.dist ) {
          best.dist = n.dist;
        }

        results.push(n);
      }
      else {
        var result = this.findRecursive(n, target, visited, best);
        if (result) {
          results.push(result);
        }
      }
    }

    results.sort((r1,r2) => r1.dist - r2.dist);

    return results[0] || null;
  }


  nextSteps(node, target, visited, best) {
    var points = [];
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (j == 0 && i == 0){
          continue;
        }

        var nextPos = node.pos.subtract($V([
          (i - j) * 24,
          (i + j) * 12
        ]));
        if (nextPos.e(1) > this.map.width * 48 || nextPos.e(2) > this.map.height * 24) {
          continue;
        }
        if (this.map.areThereAnyObstacle(node.pos, nextPos)){
          continue;
        }

        var nextNode = {
          pos: nextPos,
          dist: node.dist + nextPos.distanceFrom(node.pos),
          parent: node,
        };
        if (best.dist !== null && best.dist < nextNode.dist + target.distanceFrom(nextPos)) {
          continue;
        }

        var nodeVisited = this.nodeVisited(nextNode, visited);
        if (nodeVisited && nodeVisited.dist <= nextNode.dist) {
          continue;
        }

        points.push(nextNode);
      }
    }
    points.sort((n1,n2) => target.distanceFrom(n1.pos) - target.distanceFrom(n2.pos));
    return points;
  }

  nodeVisited(node, visited) {
    return visited.find((v) => v.pos.eql(node.pos));
  }

};
