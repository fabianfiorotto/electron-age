const DataPackage = require('../../binary/data_package');
const {Int32LE} = DataPackage;

module.exports = class AoeNetSyncClockRequest extends DataPackage {

  id() {
    return 0x31
  }

  static defineAttirbutes() {
    return {
      time_passed: Int32LE
    }
  }

}
