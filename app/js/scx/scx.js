const AoeMap = require('../map');
const CentralEuropean = require('../civilizations/styles/central_european');
const Player = require('../player');

const ScxMapReader = require('./reader');

module.exports = class ScxMapBuilder {

  static async load(file) {
    var i;

    var scenario = await ScxMapReader.read(file);

    var map = new AoeMap(scenario.map.width, scenario.map.height);

    var civ1 = new CentralEuropean();

    //TODO gaia sould be player 0
    for (i = 0; i < scenario.header.nPlayers; i++) {
      var player = new Player(map, civ1, i+1);
      map.players.push(player);
    }

    map.player = map.players[0];
    for (i = 0; i < map.width; i++) {
      for (var j = 0; j < map.height; j++) {
        var tile = scenario.map.tiles[i][j];
        map.terrain.setTile(i,j,this.getTerrainName(tile.terrain));
      }
    }


    var m = $M([
      [ 48, 48],
      [-24, 24]
      // [24, -24] invert Y axis
    ]);

    for (i = 0; i < scenario.units.length; i++) {
      var unitDef = scenario.units[i];
      const klass = this.getUnitClass(unitDef.type);
      if (klass) {
        var entity = new klass(map, map.players[unitDef.player]);
        // entity.pos = $V([unitDef.x, unitDef.y]);
        entity.pos = m.x($V([unitDef.x, unitDef.y]));
        map.entities.push(entity);
      }
    }



    return map;
  }



  static getUnitClass(code) {
    switch (code) {
      case 83:
      case 293:
        return require('../entities/town_center/villager');
      case 66: //Gold
        return require('../entities/resources/stone');
      case 102:
        return require('../entities/resources/stone');
      case 103:
        return require('../entities/blacksmith/blacksmith');
      case 104:
        return require('../entities/monastery/monastery');
      case 109:
        return require('../entities/town_center/town_center');
      case 209:
        return require('../entities/university/university');
      case 285: //relic
        return null;
      case 399:
        return require('../entities/resources/tree');
      default:
        console.log(code);
        return null;
    }
  }


  static getTerrainName(code) {
    switch (code) {
      case 0:
        return 'grass';
      case 1:
        return 'water';
      case 2:
        return 'sand';
      case 3:
        return 'dirt';
      case 4:
        return 'swamp';
      case 6:
        return 'farm_stage_3';
      case 7:
        return 'farm_stage_4';
      case 8:
        return 'green_grass';
      case 9:
        return 'dry_grass';
      case 10: // 	Forest
        return 'grass';
      case 11:
        return 'dirt';
      case 12:
        return 'dry_grass';
      case 13: // 	Palm Forest
        return 'grass'; //!
      case 14:
        return 'desert';
      case 15:
        return 'water';
      case 16: // Grass
        return 'grass';
      case 17: // Jungle
        return 'grass'; //!
      case 18: // Bamboo
        return 'grass'; //!
      case 19: // Pine Forest
        return 'grass'; //!
      case 20: // Oak Forest
        return 'grass'; //!
      case 21: // Snow Pine Forest
        return 'grass'; //!
      case 22: // Water, Deep
        return 'ocean';
      case 23:
        return deep_water;
      case 24: // Road
        return 'road';
      case 25: // Broken Road
        return 'dirty_road';
      case 26: // Trail
        return 'grass'; //!
      case 27: // Dirt2
        return 'dirty_grass';
      case 28: // Water, No Shore
        return 'water';
      case 29: // Farm, unplanted
        return 'farm_stage_0';
      case 30: // Farm, small plants
        return 'farm_stage_1';
      case 31: // Farm, large plants
        return 'farm_stage_2';
      case 32: // Snow
        return 'snow';
      case 33: // Snow Dirt
        return 'dirty_snow';
      case 34: // Snow Grass
        return 'snowy_grass';
      case 35: // Ice
        return 'ice';
      case 36: // Snow Dirt
        return 'dirty_snow';
      case 37: // Ice/Snow Shore
        return 'snow';
      case 38: // Ice Road
        return 'snowy_road';
      case 39: // Fungus Road
        return 'grassy_road';
      case 40: // Road
        return 'road';
      default:
        return 'grass';
    }
  }

};
