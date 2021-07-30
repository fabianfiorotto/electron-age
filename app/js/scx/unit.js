const DataPackage = require('../binary/data_package');

const {FloatLE, UInt32LE, UInt16LE, UInt8} = DataPackage;

module.exports = class ScxUnitPackage extends DataPackage {

  static defineAttirbutes() {
    return {
      // unit = {player: i};
      x: FloatLE,
      y: FloatLE,
      z: FloatLE,
      id: UInt32LE,
      type: UInt16LE,
      status: UInt8,
      rotation: FloatLE,
      initFrame: UInt16LE,
      guarrisonedIn: UInt32LE,
    }
  }
}
