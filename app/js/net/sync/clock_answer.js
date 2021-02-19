const DataPackage = require('../../binary/data_package');
const {Int32LE} = DataPackage;

module.exports = class AoeNetSyncClockAnswer extends DataPackage {

  id() {
    return 0x32
  }

  static defineAttirbutes() {
    return {
      time_passed: Int32LE
    }
  }

}
