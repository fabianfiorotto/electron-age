const Unit = require('../unit');

module.exports = class Camel extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 676,
        dying: 679,
        stand: 682,
        rotting: 683,
        walking: 686,
      }
    };
  }


  iconsResources() {
    return [
      {
        interface: 50730,
        frames: {
          thumbnail: 78,
        }
      },
    ];
  }

};
