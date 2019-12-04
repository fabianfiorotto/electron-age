const Civilization = require('../../civilization');

module.exports = class CentralEuropean extends Civilization {

  modelsResources() {
    return {
      dark: {
        MiningCamp: {
          building: 3492
        },
        LumberCamp: {
          building: 3504
        }
      },
      feudal: {
        House: {
          building: 2232
        },
        Mill: {
          building: 738,
          animation: 746
        },
        Dock: {
          building: 385
        },
        Galley: {
          sail: 4224
        },
        Market: {
          building: 2275
        },
        Blacksmith: {
          building: 90,
          animation: 98
        },
        Barracks:{
          building: 130
        },
        ArcheryRange: {
          building: 21
        },
        Stable: {
          building: 1006
        },
        WatchTower: {
          building: 2652
        },
        StoneWall: {
          marks: 3742,
          shadow: 4657,
          building: 2098,
          damaged0: 4169,
          damaged1: 4177,
          damaged2: 4185,
        },
        TownCenter: {
          building: 900,
          shadow: 892,
          leftRoof: 3597,
          leftColumn1: 3605,
          leftColumn2: 3601,

          rightRoof: 4613,
          rightColumn1: 4617,
          rightColumn2: 4621,
        }
      },
      castle: {
        House: {
          building: 2244
        },
        Mill: {
          building: 750
        },
        Dock: {
          building: 397
        },
        Blacksmith: {
          building: 102
        },
        Barracks: {
          building: 142
        },
        ArcheryRange: {
          building: 33
        },
        Stable: {
          building: 1018
        },
        Market: {
          building: 817
        },
        Monastery: {
          building: 278
        },
        University: {
          building: 3832
        },
        Castle: {
          building: 302
        },
        SiegeWorkshop: {
          building: 955
        },
        GuardTower: {
          building: 2656 //2664
        },
        FortifiedWall: {
          marks: 3750,
          shadow: 4661,
          building: 2110,
          damaged0: 4173,
          damaged1: 4181,
          damaged2: 4189,
        },
        TownCenter: {
          building: 912,
          shadow: 904,
          leftRoof: 3609,
          leftColumn1: 3620,
          leftColumn2: 3616,

          rightRoof: 4625,
          rightColumn1: 4632,
          rightColumn2: 4636,
        },
      },
      imperial: {
        Market: {
          building: 3794
        },
        University: {
          building: 3836
        },
        BombardTower: {
          building: 5143
        },
        Keep: {
          building: 2538
        },
        TownCenter: {
          building: 924,
          shadow: 916,
          floor: 920,
          leftRoof: 3465,
          leftColumn1: 3473,
          leftColumn2: 3469,

          rightRoof: 4637,
          rightColumn1: 4641,
          rightColumn2: 4645,
        },
      }
    };
  }

};
