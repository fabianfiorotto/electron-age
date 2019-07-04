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

    var villager2 = new Villager(this, player2);
    villager2.pos = $V([100,150]);

    this.entities = [];
    this.entities.push(new Villager(this, player1));
    this.entities.push(villager2);
    this.entities.push(new House(this, player1));
    this.entities.push(new Berries(this, player1));
    this.entities.push(new Stone(this, player1));
    this.entities.push(new Tree(this, player1));
    // this.entities.push(new Gold(this, player1));
    this.entities.push(new Archer(this, player2));

    this.emitter = new Emitter();
    this.selected = this.entities[0];
    this.player = this.players[0];

    this.terrain = [];
    this.terrainModel = null;
    this.tpos = $V([-650, 250]);
  }


  drawTerrain(camera) {
    if (this.terrainModel && this.terrain.length) {
      for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
          var f = this.terrain[i][j];
          var w = f.width - 1, h = f.height - 1;
          var cell = $V([
            (i + j) * w / 2,
            (i - j) * h / 2
          ]);
          f.drawTerrain(this.tpos.add(cell).subtract(camera));
        }
      }
    }
  }

  draw(camera) {
    var ctx = resources.get2DContext();
    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    this.selected.drawSelection(camera);
    ctx.stroke();
    // ---
    this.entities.forEach((unit) => {
      unit.draw(camera);
    });
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

  removeEntity(entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  async loadResources(res) {
    await res.loadPalette(50505);
    for (var i = 0; i < this.entities.length; i++) {
      resources.load(this.entities[i]);
    }
    this.terrainModel = await res.loadTerrain(15009);
    this.terrainModel.load({
      base: resources.palettes[50505],
      player: 0
    });

    this.sand = await res.loadTerrain(15010);
    this.sand.load({
      base: resources.palettes[50505],
      player: 0
    });

    for (i = 0; i < this.width; i++) {
      this.terrain.push([]);
      for (var j = 0; j < this.height; j++) {
        var m;
        if (i > 10 && i < 20 && j > 10 && j < 20 ){
          m = this.sand;
        }
        else {
          m = this.terrainModel;
        }

        var frame_id = (j % m.tc) + ((i % m.tc) * m.tc);
        this.terrain[i].push(m.frames[frame_id]);
      }
    }
  }

  over(v) {
    if (this.selected instanceof Villager && this.selected.building) {
      this.selected.building.pos = v;
    }
  }

  canPlace(building , pos) {
    // Too slow
    for (var i = 0; i < this.entities.length; i++) {
      var entity = this.entities[i];
      if (entity !== building && entity instanceof Building) {
        var v = entity.pos.subtract(pos).map((e) => Math.abs(e));
        var size = 10 * entity.getSize();
        if (v.e(1) < size || v.e(2) < size) {
          return false;
        }
      }
    }
    return true;
  }

  rightClick(v) {
    var entity = this.clickEntity(v);
    this.selected.setTarget(entity);
    this.selected.setPath([v]);
  }

  leftClick(v) {
    var entity = this.clickEntity(v);
    if (entity) {
      if (this.selected) {
        this.selected.blur();
      }
      this.selected = entity;
      this.selected.click();
      this.emitter.emit('did-change-selection', this.selected);
    }
  }

  clickEntity(v) {
    for (var i = 0; i < this.entities.length; i++) {
      if (this.entities[i].canClick(v)) {
        return this.entities[i];
      }
    }
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
