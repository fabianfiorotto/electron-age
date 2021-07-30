const DataPackage = require('../binary/data_package');

const {UInt32LE} = DataPackage;

module.exports = class ScxPlayerPackage extends DataPackage {

  static defineAttirbutes() {
    return {
      active: UInt32LE,
      human: UInt32LE,
      civilization: UInt32LE,
      cty_mode: UInt32LE,
    }
  }
}
