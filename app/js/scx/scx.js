const AoeMap = require('../map');

const CentralEuropean = require('../civilizations/styles/central_european');
const WestEuropean = require('../civilizations/styles/west_european');
const Asian = require('../civilizations/styles/asian');
const Arabic = require('../civilizations/styles/arabic');

const Player = require('../player');

const ScxMapReader = require('./reader');

module.exports = class ScxMapBuilder {

  static async load(file) {
    var i;

    var scenario = await ScxMapReader.read(file);

    var map = new AoeMap(scenario.map.width, scenario.map.height);

    //TODO gaia sould be player 0

    var civ = new WestEuropean();// GAIA;
    var player = new Player(map, civ, 0);
    map.players.push(player);

    for (i = 0; i < scenario.header.nPlayers; i++) {
      console.log(scenario.players[i]);
      var klass = this.getCivilizationClass(scenario.players[i].civilization);
      civ = new klass();
      player = new Player(map, civ, i+1);
      map.players.push(player);
    }

    map.player = map.players[0];
    for (i = 0; i < map.width; i++) {
      for (var j = 0; j < map.height; j++) {
        var tile = scenario.map.tiles[i][j];
        map.terrain.setTile(i,j,this.getTerrainName(tile.terrain));
      }
    }

    await map.loadResources(resources);
    var m = map.terrain.m;

    for (i = 0; i < scenario.units.length; i++) {
      var unitDef = scenario.units[i];
      const klass = this.getUnitClass(unitDef.type);
      if (klass) {
        var entity = new klass(map, map.players[unitDef.player]);
        // entity.pos = $V([unitDef.x, unitDef.y]);
        entity.pos = m.x($V([unitDef.x, unitDef.y]));
        await map.addEntity(entity);
      }
    }


    map.initCameraPos = $V([6250, -200]);
    return map;
  }



  static getUnitClass(code) {
    switch (code) {
      case 12:
        return require('../entities/barracks/barracks');
      case 83:
      case 293:
        return require('../entities/town_center/villager');
      case 66: //Gold
        return require('../entities/resources/stone');
      case 68:
        return require('../entities/mill/mill');
      case 70:
        return require('../entities/house/house');
      case 82:
        return require('../entities/castle/castle');
      case 84:
        return require('../entities/market/market');
      case 87:
        return require('../entities/archery_range/archery_range');
      case 101:
        return require('../entities/stable/stable');
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
      case 539:
        return require('../entities/dock/galley');
      case 562:
        return require('../entities/resources/lumber_camp');
      case 584:
        return require('../entities/resources/mining_camp');
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
        return 'deep_water';
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

 static getCivilizationClass(code) {
    switch (code) {
      case 0:
      case 1:
        return WestEuropean;
      case 5:
      case 6:
        return Asian;
      case 10:
        return Arabic;
      case 11:
        return CentralEuropean;
      default:
        return WestEuropean;
    }
  }


};
