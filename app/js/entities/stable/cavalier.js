const Unit = require('../unit');

module.exports = class Cavalier extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 849,
        dying: 852,
        stand: 855,
        rotting: 856,
        walking: 859,
      }
    };
  }


  iconsResources() {
    return [
      {
        interface: 50730,
        frames: {
          thumbnail: 49,
        }
      },
    ];
  }

};
