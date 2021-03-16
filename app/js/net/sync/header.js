const DataPackage = require('../../binary/data_package');
const {Int8, Int32LE} = DataPackage;

module.exports = class AoeNetSyncHeader extends DataPackage {

  static defineAttirbutes() {
    return {
      option1: UInt8,
      option2: UInt8,
      option3: UInt8,
    }
  }

}
