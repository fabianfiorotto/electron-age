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
        TownCenter: {
          building: 900,
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
        TownCenter: {
          building: 912,
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
        TownCenter: {
          building: 924,
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
