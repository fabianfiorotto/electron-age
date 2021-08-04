const DataPackage = require('../../binary/data_package');
const {Int32LE, Int16LE, Int8, BytesData, ArrayData} = DataPackage;

module.exports = class AoeNetLobbyConfig extends DataPackage {

  id() {
    return 0x5a
  }

  static defineAttirbutes() {
    return {
      communication_turn: Int32LE,
      individual_counter: Int32LE,
      fourBytes: BytesData(4), // ??

      player_network_ids: ArrayData({
        length: 8,
        type: Int32LE,
      }),

      ready: Int8,

      sixtyNineBytes: BytesData(69), // ??

      starting_age_and_resources: Int8,
      map_size_and_difficulty: Int8,
      map_id: Int8,
      victory: Int8,
      oneByte: Int8, // ??
      victory_limit: Int16LE,
      max_population: Int8,
      eightBytes: BytesData(8), // ??

      player_civ_id: ArrayData({
        length: 8,
        type: Int8
      }),

      sixteenBytes: BytesData(16), // ??

      teams: ArrayData({
        length: 8,
        type: Int8
      }),
      zero: Int16LE,

      map_description_length: Int8,

      map_description: ArrayData({
        length: (that) => that.map_description_length + 6,
        type: Int8
      })
    }
  }

  flipBit(byte, pos, value) {
    let bits = 2 ** (pos - 1);
    return value ? (byte | bits) : (byte & (255 ^ bits));
  }

  setReady(playerId , value) {
    this.ready = this.flipBit(this.ready, playerId, value)
  }

  perform() {
    if (lobby && lobby.ready) {
      lobby.ready.checked = !!this.ready;
    }
  }

}
