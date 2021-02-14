const Header = require('./actions/header');
const Action = require('./actions/primary');

const SyncHeader = require('./sync/header');

module.exports = class AoeNetProtocol {


 static receivePackage(reader) {
   let package1 = {};
   if (reader.buffer.length == 16) {
     package1.header = SyncHeader.read(reader);
   }
   else {
     package1.header = Header.read(reader);
   }

   switch (package1.header.command) {
     case 0x3e:
       package1.action = Action.read(reader);
       break;
     default:

   }

   // 0x31 	Sync
   // 0x32 	Sync
   // 0x35 	Sync (Lobby)
   // 0x3e 	Player-issued
   // 0x41 	Sync
   // 0x43 	Chat Message
   // 0x44 	Sync
   // 0x4d 	Sync
   // 0x51 	De-Sync
   // 0x52 	Readying (Lobby)
   // 0x53 	Sync
   // 0x5a 	Lobby
   return package1;
 }

}
