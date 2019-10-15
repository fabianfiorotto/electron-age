const fs = require("fs").promises;

const BinaryReader = require('../binary_reader');
// https://github.com/SFTtech/openage/blob/e9e29ebf8d7f50716ecf9df689d1e3e38dff3e40/openage/convert/blendomatic.py#L228
const BlendingMode = require('./mode');

module.exports = class Blendomatic {

  static async getBlendingModes(filename) {
    if (!filename) {
      filename = resources.dir + "/DATA/blendomatic.dat";
    }
    var file = await fs.open(filename, "r");
    var reader = new BinaryReader();
    await reader.loadFile(file);

    var numBlendingModes = reader.readUInt32LE();
    var numTiles = reader.readUInt32LE();
    var i, j, k, pixels;

    var modes = [];

    for (i = 0; i < numBlendingModes; i++) {
      var mode = new BlendingMode();

      mode.tileSize = reader.readUInt32LE(); // normally 2353
      mode.tileFlags = reader.readBytes(numTiles);
      mode.rowCount = Math.floor(Math.sqrt(mode.tileSize)) + 1;  // should be 49

      mode.alphamasks = [];

      // var alphaBitmaskRaw = reader.readBytes(tileSize);
      var alphaBitmaskRaw = reader.readBytes(mode.tileSize * 4);

      for (j = 0; j < numTiles; j++) {
        pixels = reader.readBytes(mode.tileSize);
        mode.alphamasks.push(
          mode.getTileFromData(pixels)
        );
      }

      var bitvalues = [];
      for (j of alphaBitmaskRaw) {
        for (k = 7; k >= 0; k--) {
          var bit_mask = 2 ** k;
          bitvalues.push(j & bit_mask);
        }
      }

      mode.bitmasks = [];
      for (j = 0; j < 32; j++) { // why 32? maybe nr_tiles + 1?
        pixels = bitvalues.slice(j * mode.tileSize, (j+1) * mode.tileSize);
        pixels = Buffer.from(pixels);
        // with tile_size pixels, use the data bitwise.
        mode.bitmasks.push(
          mode.getTileFromData(pixels)
        );
      }
      modes.push(mode);
    }
    // resources.putImage(modes[0].alphamasks[0] , $V([0,0]));
    console.log(modes);
    return modes;
  }

};
