const DataPackage = require('../../binary/data_package');
const {Int32LE} = DataPackage;

module.exports = class AoeNetSyncLobbyClock extends DataPackage {


  static HOST_CONNECTING1 = 0x32d2a4;
  static PLAYER_CONNECTING1 = 0x503a87;

  static HOST_CONNECTING2 = 0x5016b5;
  static PLAYER_CONNECTING2 = 0x32b5c4;

  static PLAYER_CONNECTED = 0xFFFFFFFF;

  id() {
    return 0x35
  }

  static defineAttirbutes() {
    return {
      connecting1: Int32LE,
      unknown: Int32LE,
      connecting2: Int32LE,
    }
  }

}
