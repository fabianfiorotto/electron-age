const DataPackage = require('../binary/data_package');

const {UInt8} = DataPackage;

module.exports = class ScxTilePackage extends DataPackage {

  static defineAttirbutes() {
    return {
      terrain: UInt8,
      elevation: UInt8,
      unused: UInt8,
    }
  }
}
