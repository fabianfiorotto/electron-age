const DataPackage = require('../binary/data_package');
const {UInt8, UInt32LE, SwitchData} = DataPackage;

const NetAction = require('./actions/action');

const LobbyTurn = require('./sync/lobby_turn');
const LobbyClock = require('./sync/lobby_clock');
const LobbyConfig = require('./sync/lobby_config');

module.exports = class AoeNetPackage extends DataPackage {


  beforePack() {
    this.command_identifier = this.command.id();
  }

  static defineAttirbutes() {
    return {
      network_source_id: UInt32LE,
      network_dest_id: UInt32LE,
      command_identifier: UInt8,
      option1: UInt8,
      option2: UInt8,
      option3: UInt8,
      command: SwitchData({
        switch: (that) => that.command_identifier,
        cases: {
          // 0x31 	Sync
          // 0x32 	Sync
          0x35: LobbyClock,
          0x3e: NetAction,
          // 0x41 	Sync
          // 0x43 	Chat Message
          // 0x44 	Sync
          // 0x4d 	Sync
          // 0x51 	De-Sync
          // 0x52 	Readying (Lobby)
          0x53: LobbyTurn,
          0x5a: LobbyConfig
        },
        // default: LobbyTurn,
      })
    }
  }

  perform(map) {
    this.command.perform(map);
  }

}
