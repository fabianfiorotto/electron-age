const DataPackage = require('../../binary/data_package');
const {Int32LE, Int16LE, Int8, UInt8, BytesData, ArrayData} = DataPackage;

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

      ready: UInt8,

      sixtyNineBytes: BytesData(69), // ??

      checkboxes: UInt8,
      reveal_map_and_game_speed: UInt8,
      starting_age_and_resources: UInt8,
      map_size_and_difficulty: UInt8,
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

  setBit(byte, pos, value) {
    let bits = 2 ** (pos - 1);
    return value ? (byte | bits) : (byte & (255 ^ bits));
  }

  getBit(byte, pos) {
    let bits = 2 ** (pos - 1);
    return !!(bits & byte)
  }

  setReady(playerId , value) {
    this.ready = this.setBit(this.ready, playerId, value)
  }

  setCheckbox(checkbox, value) {
    value = !!((checkbox == 7) ^ value);
    this.checkboxes = this.setBit(this.checkboxes, checkbox, value);
  }

  getCheckbox(checkbox) {
    let value = this.getBit(this.checkboxes, checkbox)
    return !!((checkbox == 7) ^ value)
  }

  setRevealMap(value) {
    let byte = this.reveal_map_and_game_speed;
    this.reveal_map_and_game_speed = (byte & 0xf3) | (value & 0x0c);
  }

  getRevealMap() {
    return this.reveal_map_and_game_speed & 0x0c;
  }

  setGameSpeed(value) {
    let byte = this.reveal_map_and_game_speed;
    this.reveal_map_and_game_speed = (byte & 0xfc) | (value & 0x03);
  }

  getGameSpeed() {
    return this.reveal_map_and_game_speed & 0x03;
  }

  setStartingAges(value) {
    let byte = this.starting_age_and_resources;
    this.starting_age_and_resources = (byte & 0x0f) | (value & 0xf0);
  }

  getStartingAges() {
    return this.starting_age_and_resources & 0xf0;
  }

  setStartingResources(value) {
    let byte = this.starting_age_and_resources;
    this.starting_age_and_resources = (byte & 0xf0) | (value & 0x0f);
  }

  getStartingResources() {
    return this.starting_age_and_resources & 0x0f;
  }

  setMapSize(value) {
    let byte = this.map_size_and_difficulty;
    this.map_size_and_difficulty = (byte & 0x0f) | (value & 0xf0);
  }

  getMapSize() {
    return this.map_size_and_difficulty & 0xf0;
  }

  setDifficulty(value) {
    let byte = this.map_size_and_difficulty;
    this.map_size_and_difficulty = (byte & 0xf0) | (value & 0x0f);
  }

  getDifficulty() {
    return this.map_size_and_difficulty & 0x0f;
  }

  perform() {
    if (lobby && lobby.ready) {
      lobby.loadFromPackage(this);
    }
  }

}
