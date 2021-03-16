const DataPackage = require('../../binary/data_package');
const {Int32LE} = DataPackage;

module.exports = class AoeNetSyncLobbyClockClient extends DataPackage {

  id() {
    return 0x35
  }

  static defineAttirbutes() {
    return {
      communication_turn: Int32LE
    }
  }

}
