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
        }
      },
      castle: {
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
      },
      imperial: {
        House: {
          building: 2244
        },
        Market: {
          building: 3794
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
        }
      }
    };
  }

};
