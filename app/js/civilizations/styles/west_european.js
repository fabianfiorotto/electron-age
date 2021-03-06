const Civilization = require('../../civilization');

module.exports = class CentralEuropean extends Civilization {

  interface() {
    return 51144;
  }

  modelsResources() {
    return {
      dark: {
        MiningCamp: {
          building: 3495
        },
        LumberCamp: {
          building: 3507
        }
      },
      feudal: {
        House: {
          building: 2235
        },
        Mill: {
          building: 741,
          animation: 749
        },
        Dock: {
          building: 388
        },
        Galley: {
          sail: 4227
        },
        Market: {
          building: 2278
        },
        Blacksmith: {
          building: 93,
          animation: 101
        },
        Barracks:{
          building: 133
        },
        ArcheryRange: {
          building: 24
        },
        Stable: {
          building: 1009
        },
        WatchTower: {
          building: 2667
        },
        StoneWall: {
          marks: 3745,
          shadow: 4660,
          building: 2101,
          damaged0: 4172,
          damaged1: 4180,
          damaged2: 4188,
        },
        Gate: {
          leftWall: 2101,
          rightWall: 2101,
          marks1: 4070, //    ==
          marks2: 3709, //    //
          marks3: 3725, //    \\
          marks4: 4158, //    ||

          closed1: 4002,   //    ==
          closed2: 2430,   //    //
          closed3: 1929,   //    \\
          closed4: 4090,   //    ||

          open1: 4026,     //    ==
          open2: 2466,     //    //
          open3: 2358,     //    \\
          open4: 4114,     //    ||

        },
        TownCenter: {
          building: 903,
          shadow: 895,
          leftRoof: 3600,
          leftColumn1: 3608,
          leftColumn2: 3604,

          rightRoof: 4616,
          rightColumn1: 4620,
          rightColumn2: 4624,
        }
      },
      castle: {
        House: {
          building: 2247
        },
        Mill: {
          building: 753
        },
        Dock: {
          building: 400
        },
        Blacksmith: {
          building: 105
        },
        Barracks: {
          building: 145
        },
        ArcheryRange: {
          building: 36
        },
        Stable: {
          building: 1021
        },
        Market: {
          building: 820
        },
        Monastery: {
          building: 281,
          shadow: 273
        },
        University: {
          building: 3835
        },
        Castle: {
          building: 305
        },
        SiegeWorkshop: {
          building: 958
        },
        GuardTower: {
          building: 2655
        },
        FortifiedWall: {
          marks: 3753,
          building: 2113,
          shadow: 4664,
          damaged0: 4176,
          damaged1: 4184,
          damaged2: 4192,
        },
        TownCenter: {
          building: 915,
          shadow: 907,
          leftRoof: 3612,
          leftColumn1: 3620,
          leftColumn2: 3616,

          rightRoof: 4628,
          rightColumn1: 4632,
          rightColumn2: 4636,
        }
      },
      imperial: {
        Market: {
          building: 3797
        },
        University: {
          building: 3839
        },
        BombardTower: {
          building: 2549
        },
        Keep: {
          building: 2541
        },
        TownCenter: {
          building: 927,
          shadow: 919,
          floor: 923,
          leftRoof: 3468,
          leftColumn1: 3476,
          leftColumn2: 3472,

          rightRoof: 4640,
          rightColumn2: 4648,
          rightColumn1: 4644,
        },
      }
    };
  }

};
