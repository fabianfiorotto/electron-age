const DataPackage = require('../../binary/data_package');
const {UInt8, UInt32LE} = DataPackage;

module.exports = class AoeNetHeader extends DataPackage {

  static defineAttirbutes() {
    return {
      option1: UInt8,
      option2: UInt8,
      option3: UInt8,
      communication_turn: UInt32LE,
      individual_counter: UInt32LE
    }
  }

}
