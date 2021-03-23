const DataPackage = require('../../binary/data_package');
const {Int32LE} = DataPackage;

module.exports = class AoeNetSyncLobbyTurn extends DataPackage {

  id() {
    return 0x53
  }

  static defineAttirbutes() {
    return {
      communication_turn: Int32LE
    }
  }

}
