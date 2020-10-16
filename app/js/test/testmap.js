const AoeMap = require('../map');

const TownCenter = require("../entities/town_center/town_center");
const Villager = require("../entities/town_center/villager");
const Sheep = require('../entities/mill/sheep');
const House = require('../entities/house/house');
const Berries = require('../entities/resources/berries');
const Stone = require('../entities/resources/stone');
const Tree = require('../entities/resources/tree');
const Gold = require('../entities/resources/gold');

const Archer = require("../entities/archery_range/archer");
const ScoutCavalry = require("../entities/stable/scout");

const Galley = require("../entities/dock/galley");
const Trebuchet = require('../entities/castle/trebuchet');

const CentralEuropean = require('../civilizations/styles/central_european');
const WestEuropean = require('../civilizations/styles/west_european');
const Player = require('../player');

module.exports =  class TestBuilder {

  static async loadTestMap(progress) {
    var map = new AoeMap(120, 120);
    await map.loadResources(resources);

    var civ1 = new CentralEuropean();
    var civ2 = new WestEuropean();

    var gaia = new Player(map, civ1, 0);
    var player1 = new Player(map, civ1, 1);
    var player2 = new Player(map, civ2, 2);
    map.players.push(gaia);
    map.players.push(player1);
    map.players.push(player2);


    var entity, entities;
    entities = [];

    entity = new Villager(map, player1);
    entity.pos = $V([767.75, 69]);
    entities.push(entity)

    entity = new Villager(map, player2);
    entity.pos = $V([240, -24]);
    entities.push(entity)

    // entity = new House(map, player1);
    // entity.pos = $V([384, 96]);
    // entities.push(entity)

    entities.push(new Berries(map, gaia));

    entities.push(new Stone(map, gaia));
    entities.push(new Tree(map, gaia));
    entities.push(new Gold(map, gaia));

    entity = new Archer(map, player2);
    // entity = new Trebuchet(map, player2);
    entity.pos = $V([474.90422568373566, 81.54880164849791]);
    entities.push(entity)

    // await this.addEntity(map, Sheep,1039, 63, player1);
    entity = new ScoutCavalry(map, player2);
    entity.pos = $V([1039, 63]);
    entities.push(entity)

    entity = new TownCenter(map, player1);
    entity.pos = $V([864, -144]);
    entities.push(entity)

    for ( const [i, entity] of entities.entries()) {
      progress?.( (i+1) / entities.length , "Loading Entities...");
      await map.addEntity(entity);
    }

    //???
    map.selected = [map.entities[0]];
    map.player = map.players[0];

    for (var i = 0; i < map.height; i++) {
      for (var j = 0; j < map.width; j++) {
        if (i > 10 && i < 20 && j > 10 && j < 20 ){
          map.terrain.setTile(i,j, 'desert');
        }
        else {
          map.terrain.setTile(i,j, 'grass');
        }
      }
    }

    map.initCameraPos = $V([0, -340]);
    return map;
  }

};
