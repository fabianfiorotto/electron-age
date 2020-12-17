const Civilization = require('../../civilization');

module.exports = class CentralEuropean extends Civilization {

  interface() {
    return 51146;
  }

  modelsResources() {
    return {
      dark: {
        MiningCamp: {
          building: 3493
        },
        LumberCamp: {
          building: 3505
        }
      },
      feudal: {
        House: {
          building: 2233
        },
        Mill: {
          building: 739,
          animation: 747
        },
        Dock: {
          building: 386
        },
        Galley: {
          sail: 4225
        },
        Market: {
          building: 2276
        },
        Blacksmith: {
          building: 91,
          animation: 99
        },
        Barracks:{
          building: 131
        },
        ArcheryRange: {
          building: 22
        },
        Stable: {
          building: 1007
        },
        WatchTower: {
          building: 2652
        },
        StoneWall: {
          marks: 3743,
          shadow: 4658,
          building: 2099,
          damaged0: 4170,
          damaged1: 4178,
          damaged2: 4186,
        },
        Gate: {
          leftWall: 2099,
          rightWall: 2099,

          marks1: 4068, //    ==
          marks2: 3707, //    //
          marks3: 3723, //    \\
          marks4: 4156, //    ||

          closed1: 4000,   //    ==
          closed2: 2428,   //    //
          closed3: 1927,   //    \\
          closed4: 4088,   //    ||

          open1: 4024,     //    ==
          open2: 2464,     //    //
          open3: 2356,     //    \\
          open4: 4112,     //    ||
        },
        TownCenter: {
          building: 901,
          shadow: 893,
          leftRoof: 3598,
          leftColumn1: 3606,
          leftColumn2: 3602,

          rightRoof: 4614,
          rightColumn1: 4618,
          rightColumn2: 4622,
        }
      },
      castle: {
        House: {
          building: 2245
        },
        Mill: {
          building: 751
        },
        Dock: {
          building: 398
        },
        Blacksmith: {
          building: 103
        },
        Barracks: {
          building: 143
        },
        ArcheryRange: {
          building: 34
        },
        Stable: {
          building: 1019
        },
        Market: {
          building: 818
        },
        Monastery: {
          building: 279
        },
        University: {
          building: 3833
        },
        Castle: {
          building: 303
        },
        SiegeWorkshop: {
          building: 956
        },
        GuardTower: {
          building: 2656
        },
        FortifiedWall: {
          building: 2111,
          marks: 3751,
          shadow: 4662,
          damaged0: 4174,
          damaged1: 4182,
          damaged2: 4190
        },
        TownCenter: {
          building: 913,
          shadow: 905,
          leftRoof: 3610,
          leftColumn1: 3618,
          leftColumn2: 3614,

          rightRoof: 4626,
          rightColumn1: 4630,
          rightColumn2: 4634,
        },
      },
      imperial: {
        Market: {
          building: 3795
        },
        University: {
          building: 3837
        },
        BombardTower: {
          building: 5143
        },
        Keep: {
          building: 2538
        },
        TownCenter: {
          building: 925,
          shadow: 917,
          floor: 921,
          leftRoof: 3466,
          leftColumn1: 3474,
          leftColumn2: 3470,
          rightRoof: 4638,
          rightColumn1: 4642,
          rightColumn2: 4646,
        },
      }
    };
  }

};
