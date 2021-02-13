const DataPackage = require('../../binary/data_package');
const {UInt8, UInt32LE} = DataPackage;

module.exports = class AoeNetHeader extends DataPackage {

  static defineAttirbutes() {
    return {
      network_source_id: UInt32LE,
      network_dest_id: UInt32LE,
      command: UInt8,
      option1: UInt8,
      option2: UInt8,
      option3: UInt8,
      communication_turn: UInt32LE,
      individual_counter: UInt32LE
    }
  }

}
