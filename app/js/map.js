const Villager = require("./entities/town_center/villager");
const House = require('./entities/house/house');
const Berries = require('./entities/resources/berries');
const Stone = require('./entities/resources/stone');
const Tree = require('./entities/resources/tree');
const Gold = require('./entities/resources/gold');
const Building = require("./entities/building");

const Archer = require("./entities/archery_range/archer");

const CentralEuropean = require('./civilizations/styles/central_european');
const WestEuropean = require('./civilizations/styles/west_european');
const Player = require('./player');
const Terrain = require('./terrain/terrain');

const PathFinder = require('./pathfinder');
const {Emitter} = require('event-kit');

module.exports = class AoeMap {

  constructor(width, height) {

    this.width = width;
    this.height = height;

    this.Villager = Villager; // This avoids ciclic dependencie among tc and villager

    var civ1 = new CentralEuropean();
    var civ2 = new WestEuropean();

    var player1 = new Player(this, civ1, 1);
    var player2 = new Player(this, civ2, 2);
    this.players = [];
    this.players.push(player1);
    this.players.push(player2);

    var villager2 = new Villager(this, player1);
    villager2.pos = $V([100,150]);

    this.entities = [];
    this.entities.push(new Villager(this, player2));
    this.entities.push(villager2);
    this.entities.push(new House(this, player1));
    this.entities.push(new Berries(this, player1));
    this.entities.push(new Stone(this, player1));
    this.entities.push(new Tree(this, player1));
    // this.entities.push(new Gold(this, player1));
    this.entities.push(new Archer(this, player2));

    this.emitter = new Emitter();
    this.selected = [this.entities[0]];
    this.player = this.players[0];

    this.terrain = new Terrain(width, height);
    this.pathfinder = new PathFinder(this);
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

  addEntity(entity) {
    resources.load(entity);
    this.entities.push(entity);
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
    for (var i = 0; i < this.entities.length; i++) {
      resources.load(this.entities[i]);
    }
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
    return true;
  }

  areThereAnyObstacle(pos, v) {
    if (this.entities.some((e) => e.isAtVec(pos, v))) {
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
      var path = this.pathfinder.find(selected.pos, v);
      selected.setPath(path);
    }
  }

  leftClick(v) {

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
      selected.blur();
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
