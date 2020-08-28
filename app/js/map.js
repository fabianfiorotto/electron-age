const Villager = require("./entities/town_center/villager");
const Building = require("./entities/building");
const Boat = require("./entities/dock/boat");

const Terrain = require('./terrain/terrain');

const PathFinder = require('./pathfinder');
const {Emitter} = require('event-kit');

module.exports = class AoeMap {

  constructor(width, height) {

    this.width = width;
    this.height = height;

    this.Villager = Villager; // This avoids ciclic dependencie among tc and villager

    this.players = [];
    this.entities = [];
    this.selected = [];

    this.emitter = new Emitter();

    this.terrain = new Terrain(width, height);
    this.pathfinder = new PathFinder(this);
    this.initCameraPos = $V([0, 0]);
  }


  drawTerrain(camera) {
    this.terrain.draw(camera);
  }

  draw(camera) {
    var entity, selected;
    for (selected of this.selected) {
      selected.drawSelection(camera);
    }
    for (entity of this.entities) {
      entity.drawShadow(camera);
    }
    for (entity of this.entities) {
      entity.draw(camera);
    }
    for (selected of this.selected) {
      selected.drawHitpoints(camera);
    }


    if (this.selectionStart && this.selectionEnd) {
      var diff = this.selectionEnd.subtract(this.selectionStart);
      resources.drawSelect(this.selectionStart.subtract(camera),diff);
    }
  }

  update() {
    this.entities.forEach((unit) => {
      unit.update();
    });
    this.entities.sort((u1, u2) => u1.pos.e(2) > u2.pos.e(2) ? 1 : -1  );
  }

  async addEntity(entity) {
    await resources.load(entity);
    this.entities.push(entity);
    entity.player.applyTechnologies(entity);
    entity.onEntityCreated();
  }

  setSelected(newSelected) {
    this.selected = newSelected;
    this.emitter.emit('did-change-selection', newSelected);
  }

  removeEntity(entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);

    if (this.selected.indexOf(entity) !== -1) {
      this.selected.splice(this.selected.indexOf(entity), 1);
      this.emitter.emit('did-change-selection', this.selected);
    }
  }

  async loadResources(res) {
    await res.loadPalette(50505);
    //TODO call resources.load(this.terrain);
    await this.terrain.loadResources(res);
  }

  canPlace(building) {
    var pos = building.pos;
    for (var i = 0; i < this.entities.length; i++) {
      var entity = this.entities[i];
      if (entity !== building && entity instanceof Building) {
        if (entity.overlap(building)) {
          return false;
        }
      }
    }
    return building.canPlace();
  }

  areThereAnyObstacle(pos, v, target = false) {
    var t = this.terrain;
    var w = t.isWater(pos);
    if ((w && t.isLandAtVec(pos,v)) || (!w && t.isWaterAtVec(pos,v))) {
      return true;
    }
    if (this.entities.some((e) => e.isAtVec(pos, v, target))) {
      return true;
    }
    return false;
  }

  rightClick(v) {
    var entity = this.clickEntity(v);
    for (var i = 0; i < this.selected.length; i++) {
      let selected = this.selected[i];
      selected.setTarget(entity);
      var f = $V([i % 3, Math.floor(i / 3)]).multiply(50);
      selected.setTargetPos(v.add(f));
      if (selected instanceof Villager && selected.building && selected.building.isImaginary()) {
        this.removeEntity(selected.building);
        selected.building = null;
      }
    }
  }

  leftClick(v) {

  }

  setEntityTargetPos(entity, pos) {
    var target = this.clickEntity(pos);
    if (target) {
      entity.setTarget(target);
    }
    entity.setTargetPos(pos);
  }

  closest(pos ,max , condition) {
    //TODO: Optimize
    var minDist = null;
    var closest = null;
    for (var i = 0; i < this.entities.length; i++) {
      var entity = this.entities[i];
      var dist = entity.pos.distanceFrom(pos);
      if ((minDist === null || dist < minDist) && condition(entity)) {
        minDist = dist;
        closest = entity;
      }
    }
    return (max == null || minDist < max) ? closest : null;
  }

  over(v) {
    if (this.selected[0] instanceof Villager && this.selected[0].building) {
      var x = v.e(1) - v.e(1) % 48;
      var y = v.e(2) - v.e(2) % 24;
      if (!(x % 96 == 0 ^ y % 48 == 0)) {
        y += 24;
      }
      if (this.selected[0].building.getSize() % 2 == 0) {
        x -= 48;
      }
      this.selected[0].building.pos = $V([x, y]);
    }
    if (this.selectionStart) {
      this.selectionEnd = v;
    }
  }

  mouseDown(v) {
    this.selectionStart = v;
  }

  mouseUp(v) {
    var  newSelected = [];
    if (this.selectionStart && this.selectionEnd) {
      newSelected = this.selectEntites();
      newSelected = this.filterSelection(newSelected);
    }
    else {
      var entity = this.clickEntity(v);
      if (entity) {
        newSelected = [entity];
        entity.click();
      }
    }
    for (var selected of this.selected) {
      if (selected instanceof Villager && selected.building) {
        if (this.canPlace(selected.building)) {
          selected.setTargetPos(selected.building.pos)
          selected.startBuilding();
        }
        else {
          this.selectionStart = null;
          this.selectionEnd = null;
          console.log("Can't build there"); //Que no haga el ruido
          return;
        }
      }
      else {
        selected.blur();
      }
    }
    this.setSelected(newSelected);
    this.selectionStart = null;
    this.selectionEnd = null;
  }

  clickEntity(v) {
    for (var i = 0; i < this.entities.length; i++) {
      if (this.entities[i].canClick(v)) {
        return this.entities[i];
      }
    }
  }

  selectEntites() {
    var x, y, x1, y1, x2, y2;
    var entities = [];
    if (this.selectionStart.e(1) < this.selectionEnd.e(1)) {
      x1 = this.selectionStart.e(1);
      x2 = this.selectionEnd.e(1);
    }
    else {
      x1 = this.selectionEnd.e(1);
      x2 = this.selectionStart.e(1);
    }

    if (this.selectionStart.e(2) < this.selectionEnd.e(2)) {
      y1 = this.selectionStart.e(2);
      y2 = this.selectionEnd.e(2);
    }
    else {
      y1 = this.selectionEnd.e(2);
      y2 = this.selectionStart.e(2);
    }
    for (var entity of this.entities) {
      x = entity.pos.e(1);
      y = entity.pos.e(2);

      if (x >= x1 && x <= x2 && y >= y1 && y <=  y2) {
        entities.push(entity);
      }
    }
    return entities;
  }

  filterSelection(selection) {
    var player1 = this.players[0];
    // if


    return selection;
  }

  getPlayerEntities(player) {
    return this.entities.filter((e) => e.player.id == player.id);
  }

  onDidChangeSelection(callback){
    return this.emitter.on('did-change-selection', callback);
  }

  destroy() {
    this.emitter.dispose();
  }

};
