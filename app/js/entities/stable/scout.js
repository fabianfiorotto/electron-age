const Unit = require('../unit');

module.exports = class ScoutCavalry extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 2079,
        dying: 2082,
        stand: 2085,
        rotting: 2086,
        walking: 2089,
      }
    };
  }


  iconsResources() {
    return [
      {
        interface: 50730,
        frames: {
          thumbnail: 64,
        }
      },
    ];
  }

};
