const DataPackage = require('../binary/data_package');
const {UInt8, UInt32LE} = DataPackage;

const AoeNetAction = require('./actions/action');


module.exports = class AoeNetPackage extends DataPackage {


  beforePack() {
    this.command_identifier = this.command.id();
  }

  static defineAttirbutes() {
    return {
      network_source_id: UInt32LE,
      network_dest_id: UInt32LE,
      command_identifier: UInt8,
      command: {
        switch: (that) => that.command_identifier,
        cases: {
          // 0x31 	Sync
          // 0x32 	Sync
          // 0x35 	Sync (Lobby)
          0x3e: AoeNetAction
          // 0x41 	Sync
          // 0x43 	Chat Message
          // 0x44 	Sync
          // 0x4d 	Sync
          // 0x51 	De-Sync
          // 0x52 	Readying (Lobby)
          // 0x53 	Sync
          // 0x5a 	Lobby
        }
      }
    }
  }

}
