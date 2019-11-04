const Unit = require('../unit');

module.exports = class Trebuchet extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 1237,
        asmDying: 1241,
        stand: 1244,
        asmRotting: 1246,


        dying: 4572,
        rotting: 4573,

        walking: 2279,
      },
      model: {
        marks: 212,
        burningMarks: 210,
      }
    };
  }

  thumbnail() {
    // return 28; assembled // como se carga este?
    return 29;
  }


};
