const DataPackage = require('../../binary/data_package');
const {Int32LE} = DataPackage;

module.exports = class AoeNetSyncKick extends DataPackage {

  id() {
    return 0x51
  }

  static defineAttirbutes() {
    return {
      unknown3: Int32LE
    }
  }

}
