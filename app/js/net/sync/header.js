const DataPackage = require('../../binary/data_package');
const {Int8, Int32LE} = DataPackage;

module.exports = class AoeNetSyncHeader extends DataPackage {

  static defineAttirbutes() {
    return {
      network_source_id: Int32LE,
      network_dest_id: Int32LE,
      command: Int8,
      option1: UInt8,
      option2: UInt8,
      option3: UInt8,
    }
  }

}
