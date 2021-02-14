const BinaryReader = require('../binary/reader');
const pako = require('pako');

module.exports = class ScxMapReader {

  static async read(file) {
    var scenario = {};

    var reader = new BinaryReader();
    await reader.loadFile(file);

    var separator, strN, instructions;

    /*
     * Uncompresed Header
     */
    var header = {};
    header.version = parseFloat(reader.readString(4));
    header.headerSize = reader.readUInt32LE();
    header.savable = reader.readInt32LE();
    header.lastSave = reader.readUInt32LE();

    header.instructions = reader.readString(reader.readUInt32LE());
    header.indVictory = reader.readUInt32LE();
    header.nPlayers = reader.readUInt32LE();

    /*
     * Compresed Header
     */
    var bytes = reader.readBytes(reader.buffer.length - reader.offset);
    var inflate = new pako.Inflate({ level: 9, windowBits: -15});
    inflate.push(bytes, true);  // true -> last chunk
    if (inflate.err) { throw new Error(inflate.msg); }

    reader.loadBuffer(Buffer.from(inflate.result));

    var nextUID = reader.readUInt32LE();
    var version2 = reader.readFloatLE();
    var playerNames = reader.readString(16*256);

    var i,j, data;


    for (i = 0; i < 16; i++) {
      var strTablePyrNames = reader.readUInt32LE();
    }

    scenario.players = [];
    for (i = 0; i < 16; i++) {
      var player = {};
      player.active = reader.readUInt32LE();
      player.human = reader.readUInt32LE();
      player.civilization = reader.readUInt32LE();
      player.cty_mode = reader.readUInt32LE();
      scenario.players.push(player);
    }

    header.conquestMode = reader.readUInt8();
    header.missionCount = reader.readUInt16LE();
    header.missionAvailable = reader.readUInt16LE();
    header.missionTimeline = reader.readFloatLE();

    for (i = 0; i < header.missionCount; i++) {
      data = read.readBytes(30);
    }
    header.filename = reader.readString(reader.readUInt16LE());
    scenario.header = header;

    /*
     * Messages
    */

    if (version2 >= 1.18 ) {
      data = reader.readInt32LE();  // String table, Instructions
      data = reader.readInt32LE();  // String table, Hints
      data = reader.readInt32LE();  // String table, Victory
      data = reader.readInt32LE();  // String table, Loss
      data = reader.readInt32LE();  // String table, History
    }
    if (version2 >= 1.22) {
      data = reader.readInt32LE(); // String table, Scouts
    }

    data = reader.readString(reader.readUInt16LE());  // ASCII, Instructions
    data = reader.readString(reader.readUInt16LE());  // ASCII, Hints
    data = reader.readString(reader.readUInt16LE());  // ASCII, Victory
    data = reader.readString(reader.readUInt16LE());  // ASCII, Loss
    data = reader.readString(reader.readUInt16LE());  // ASCII, History
    if (version2 >= 1.22) {
      data = reader.readString(reader.readUInt16LE()); // ASCII, Scouts
    }

    /**
     * Cinematics
     */

    instructions = reader.readString(reader.readUInt16LE()); // ASCII, Pregame cinematic filename
    instructions = reader.readString(reader.readUInt16LE()); // ASCII, Victory cinematic filename
    instructions = reader.readString(reader.readUInt16LE()); // ASCII, Loss cinematic filename

    // separator = reader.readString(1); // Separator (! in some version)
    // console.log(separator);

    /**
     * Background Image
     */

    var backgroundFilename = reader.readString(reader.readUInt16LE());
    var pictureVersion = reader.readUInt32LE();
    var bitmapWidth = reader.readUInt32LE();
    var bitmapHeight = reader.readUInt32LE(); // s32 ???
    var pictureOrientation = reader.readInt16LE();

    if (bitmapWidth && bitmapHeight) {
      data = reader.readBytes(40 + bitmapWidth * bitmapHeight); //BITMAPINFOHEADER
    }
    if (pictureOrientation == -1 || pictureOrientation == 2) {
      reader.readInt32LE();  // Size
      reader.readUInt32LE();  // Width
      reader.readInt32LE();  // Height
      reader.readUInt16LE();  // Planes
      reader.readUInt16LE();  // BitCount
      reader.readUInt32LE();  // Compression
      var siz = reader.readUInt32LE();  // SizeImage SIZ
      reader.readUInt32LE();  // XPels
      reader.readUInt32LE();  // YPels
      var clr = reader.readUInt32LE();  // Colors Used CLR
      reader.readUInt32LE();  // Important Colors
      for (i = 0; i < clr; i++) {
        reader.readUInt32LE(); // Calculated: u32*ColorsUsed
      }
      for (i = 0; i < siz; i++) {
        reader.readUInt32LE(); // Calculated: u32*SizeImage
      }
    }

    /**
     * Player 2 Data
     */

    var unknown, aiNames;
    for (i = 0; i < 32; i++) {
      unknown = reader.readString(reader.readUInt16LE()); // Unknown strings (2 per player?)
    }
    for (i = 0; i < 16; i++) {
      aiNames = reader.readString(reader.readUInt16LE()); // AI names, one per player
    }
    // AI files
    for (i = 0; i < 16; i++) {
      data = reader.readUInt32LE();  // unknown, always 0
      data = reader.readUInt32LE();  // unknown, always 0
      data = reader.readString(reader.readUInt32LE()); // AI .per file text
    }
    for (i = 0; i < 16; i++) {
      data = reader.readUInt8(); // AI type, 0 = custom, 1 = standard, 2 = none. Thanks iberico.
    }
    separator = reader.readUInt32LE(); // Separator, 0xFFFFFF9D
    data = reader.readBytes(16*24); // Resources, see sub-struct below

    /**
     * Global Victory
     */
    separator = reader.readUInt32LE();  //  Separator, 0xFFFFFF9D
    // console.log(separator.toString(16));
    data = reader.readUInt32LE();  //  Boolean: conquest required? (for custom vict)
    data = reader.readUInt32LE();  //  Ruins
    data = reader.readUInt32LE();  //  Artifacts
    data = reader.readUInt32LE();  //  Discovery
    data = reader.readUInt32LE();  //  Explored % of map required
    data = reader.readUInt32LE();  //  Gold
    data = reader.readUInt32LE();  //  Boolean: all custom conditions required?
    data = reader.readUInt32LE();  //  Mode, see below
    data = reader.readUInt32LE();  //  Required score for score victory
    data = reader.readUInt32LE();  //  Time for timed game, in 10ths of a year (eg, 100 = 10yr)

    /**
     * Diplomacy
     */

    data = reader.readBytes(16*64); // Per-player diplomacy, see sub-struct below
    data = reader.readBytes(11520); // Individual Victories (12 Conditions per 16 Players)
    separator = reader.readUInt32LE();  // Separator, 0xFFFFFF9D
    for (i = 0; i < 16; i++) {
      data = reader.readUInt32LE(); // Boolean: Allied vict, per-player. Ignored (see PData3). Thanks iberico.
    }

    /**
     * Disables
     */

    for (i = 0; i < 16; i++) {
      data = reader.readUInt32LE(); // Per-player, number of disabled techs
    }

    data = reader.readBytes(16*120); // Per-player, Disabled technology IDs (30*u32)
    if (version2 >= 1.30) {
      data = reader.readString(16*120); // Per-player, Extra disabled technologies (30*u32)
    }
    for (i = 0; i < 16; i++) {
      data = reader.readUInt32LE(); // Per-player, number of disabled units
    }

    data = reader.readBytes(16*120); // Per-player, Disabled unit IDs (30*u32)
    if (version2 >1.30) {
      data = reader.readBytes(16*120); // Per-player, Extra disabled units (30*u32)
    }

    for (i = 0; i < 16; i++) {
      data = reader.readUInt32LE(); // Per-player, number of disabled buildings
    }
    data = reader.readBytes(16*80); // Per-player, Disabled building IDs (20*u32)

    if (version2 > 1.30) {
      data = reader.readBytes(16*160); // > 1.30 	Per-player, Extra disabled buildings (40*u32)
    }
    data = reader.readUInt32LE(); // Combat Mode
    data = reader.readUInt32LE(); // Naval Mode
    data = reader.readUInt32LE(); // Boolean: all techs

    for (i = 0; i < 16; i++) {
      data = reader.readUInt32LE(); // Per-player, starting age. See below. 0-8 Players, 9 - Gaia, 10-16 Unused players
    }

    /**
     * --------- MAP --------------
     */
     var map = {};

     separator = reader.readUInt32LE(); // Separator, 0xFFFFFF9D
     data = reader.readInt32LE(); // Player 1 camera, Y
     data = reader.readInt32LE(); // Player 1 camera, X
     if (version2 > 1.21) {
       data = reader.readInt32LE(); // 1.21 	AI Type (see list at bottom)
     }
     map.width = reader.readUInt32LE(); // Map Width (AOK caps at 256), W
     map.height = reader.readUInt32LE(); // Map Height (AOK caps at 256), H

     map.width =  Math.min(map.width, 256);
     map.width =  Math.min(map.height, 256);
     map.tiles = [];
     for (i = 0; i < map.width; i++) {
       map.tiles.push([]);
       for (j = 0; j < map.height; j++) {
         var tile = {};
         tile.terrain = reader.readUInt8();
         tile.elevation = reader.readUInt8();
         tile.unused = reader.readUInt8();
         map.tiles[i].push(tile);
       }
    }

    scenario.map = map;

    /*
     * UNITS
     */
    var pSections = reader.readUInt32LE();
    data = reader.readBytes(8*28); // Player data

    var units = [];
    var unitCount, unit;

    for (i = 0; i < pSections; i++) {
      unitCount = reader.readUInt32LE();
      for (j = 0; j < unitCount; j++) {
        unit = {player: i};
        unit.x = reader.readFloatLE();
        unit.y = reader.readFloatLE();
        unit.z = reader.readFloatLE();
        unit.id = reader.readUInt32LE();
        unit.type = reader.readUInt16LE();
        unit.status = reader.readUInt8();
        unit.rotation = reader.readFloatLE();
        unit.initFrame = reader.readUInt16LE();
        unit.guarrisonedIn = reader.readUInt32LE();
        units.push(unit);
      }
    }
    scenario.units = units;

    return scenario;
  }

};
