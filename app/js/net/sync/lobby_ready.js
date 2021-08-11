const DataPackage = require('../../binary/data_package');
const {Int32LE, Int8, UInt8} = DataPackage;

module.exports = class LobbyReady extends DataPackage {
  id() {
    return 0x52
  }

  // :option1 Is 0x01 when readying and 0x00 when unreadying.
  // :option2 Is 0x1e when readying and 0x00 when unreadying.

  static defineAttirbutes() {
    return {
      unknown: Int8,
      player_id: Int8,
      value: Int8,
      zero: Int32LE,
      unknown2: Int32LE, // 0x04
    }
  }

  perform() {
    if (lobby && lobby.ready) {
      lobby.setPlayerReady(this.player_id, this.value);
    }
  }

}
