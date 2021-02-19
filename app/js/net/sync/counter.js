const DataPackage = require('../../binary/data_package');
const {Int32LE} = DataPackage;

module.exports = class AoeNetSyncCounter extends DataPackage {

  id() {
    return 0x41
  }

  static defineAttirbutes() {
    return {
      individual_counter: Int32LE
    }
  }

}
