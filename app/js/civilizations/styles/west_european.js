const Civilization = require('../../civilization');

module.exports = class CentralEuropean extends Civilization {

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
        TownCenter: {
          building: 903,
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
          building: 281
        },
        University: {
          building: 3835
        },
        Castle: {
          building: 305
        },
        SiegeWorkshop: {
          building: 958
        }
      },
      imperial: {
        Market: {
          building: 3797
        },
      }
    };
  }

};
