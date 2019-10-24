const AoeMap = require('../map');

const Villager = require("../entities/town_center/villager");
const House = require('../entities/house/house');
const Berries = require('../entities/resources/berries');
const Stone = require('../entities/resources/stone');
const Tree = require('../entities/resources/tree');
const Gold = require('../entities/resources/gold');

const Archer = require("../entities/archery_range/archer");

const CentralEuropean = require('../civilizations/styles/central_european');
const WestEuropean = require('../civilizations/styles/west_european');
const Player = require('../player');

module.exports =  class TestBuilder {

  static loadTestMap() {
    var map = new AoeMap(120, 120);


    var civ1 = new CentralEuropean();
    var civ2 = new WestEuropean();

    var player1 = new Player(map, civ1, 1);
    var player2 = new Player(map, civ2, 2);
    map.players.push(player1);
    map.players.push(player2);

    var villager2 = new Villager(map, player1);
    villager2.pos = $V([100,150]);

    map.entities.push(new Villager(map, player2));
    map.entities.push(villager2);
    map.entities.push(new House(map, player1));
    map.entities.push(new Berries(map, player1));
    map.entities.push(new Stone(map, player1));
    map.entities.push(new Tree(map, player1));
    // map.entities.push(new Gold(map, player1));
    map.entities.push(new Archer(map, player2));

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

    return map;
  }

};
