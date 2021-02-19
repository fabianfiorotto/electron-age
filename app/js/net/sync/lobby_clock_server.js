const DataPackage = require('../../binary/data_package');
const {Int32LE} = DataPackage;

module.exports = class AoeNetSyncLobbyClockServer extends DataPackage {

  id() {
    return 0x53
  }

  static defineAttirbutes() {
    return {
      connecting1: Int32,
      unknown: Int32,
      connecting2: Int32,
    }
  }

}
