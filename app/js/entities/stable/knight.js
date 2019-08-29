const Unit = require('../unit');

module.exports = class Knight extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 663,
        dying: 666,
        stand: 669,
        rotting: 670,
        walking: 673,
      }
    };
  }


  iconsResources() {
    return [
      {
        interface: 50730,
        frames: {
          thumbnail: 1,
        }
      },
    ];
  }

};
