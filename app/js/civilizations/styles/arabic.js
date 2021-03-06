const Civilization = require('../../civilization');

module.exports = class CentralEuropean extends Civilization {

  interface() {
    return 51143;
  }

  modelsResources() {
    return {
      dark: {
        MiningCamp: {
          building: 3494
        },
        LumberCamp: {
          building: 3506
        }
      },
      feudal: {
        House: {
          building: 2234
        },
        Mill: {
          building: 740,
          animation: 748
        },
        Dock: {
          building: 387
        },
        Galley: {
          sail: 4226
        },
        Market: {
          building: 2277
        },
        Blacksmith: {
          building: 92,
          animation: 100
        },
        Barracks:{
          building: 132
        },
        ArcheryRange: {
          building: 23
        },
        Stable: {
          building: 1008
        },
        WatchTower: {
          building: 2652
        },
        StoneWall: {
          marks: 3744,
          shadow: 4659,
          building: 2100,
          damaged0: 4171,
          damaged1: 4179,
          damaged2: 4187
        },
        Gate: {
          leftWall: 2100,
          rightWall: 2100,

          marks1: 4069, //    ==
          marks2: 3708, //    //
          marks3: 3724, //    \\
          marks4: 4157, //    ||

          closed1: 4001,   //    ==
          closed2: 2429,   //    //
          closed3: 1928,   //    \\
          closed4: 4089,   //    ||

          open1: 4025,     //    ==
          open2: 2465,     //    //
          open3: 2357,     //    \\
          open4: 4113,     //    ||
        },
        TownCenter: {
          building: 902,
          shadow: 894,
          leftRoof: 3599,
          leftColumn1: 3607,
          leftColumn2: 3603,

          rightRoof: 4615,
          rightColumn1: 4619,
          rightColumn2: 4623,
        }
      },
      castle: {
        House: {
          building: 2246
        },
        Mill: {
          building: 752
        },
        Dock: {
          building: 399 // 411
        },
        Blacksmith: {
          building: 104
        },
        Barracks: {
          building: 144
        },
        ArcheryRange: {
          building: 35
        },
        Stable: {
          building: 1020
        },
        Market: {
          building: 819
        },
        Monastery: {
          building: 280
        },
        University: {
          building: 3834
        },
        Castle: {
          building: 304
        },
        SiegeWorkshop: {
          building: 957
        },
        GuardTower: {
          building: 2656
        },
        FortifiedWall: {
          marks: 3752,
          shadow: 4663,
          building: 2112,
          damaged0: 4175,
          damaged1: 4183,
          damaged2: 4191
        },
        TownCenter: {
          building: 914,
          shadow: 906,
          leftRoof: 3611,
          leftColumn1: 3619,
          leftColumn2: 3615,

          rightRoof: 4627,
          rightColumn1: 4631,
          rightColumn2: 4635,
        },
      },
      imperial: {
        Market: {
          building: 3796
        },
        University: {
          building: 3838
        },
        BombardTower: {
          building: 5143
        },
        Keep: {
          building: 2538
        },
        TownCenter: {
          building: 926,
          shadow: 918,
          floor: 922,
          leftRoof: 3467,
          leftColumn1: 3475,
          leftColumn2: 3471,

          rightRoof: 4639,
          rightColumn1: 4643,
          rightColumn2: 4647,
        },
      }
    };
  }

};
