const BinaryReader = require('../binary_reader');

const SlpFrame = require('./frame');
const SlpRow = require('./row');

module.exports = class SlpModel {

  async loadFrames(file) {

    var reader = new BinaryReader(file);
    await reader.loadFile(file);

    this.frames = [];

    var version = reader.readString(4);
    var numFrames = reader.readInt32LE();
    var comment = reader.readString(24);

    if (version != "2.0N") {
      console.log("Version " + version + " not supported: " + comment);
    }

    var i, j, info, frame, row;
    var framesInfo = [];
    this.frames = [];
    for (i = 0; i < numFrames; i++) {
      info = {};
      frame = new SlpFrame();

      info.cmdTableOffset = reader.readUInt32LE();
      info.outlineTableOffset = reader.readUInt32LE();
      info.paletteOffset = reader.readUInt32LE();
      info.properties = reader.readUInt32LE();

      frame.width = reader.readInt32LE();
      frame.height = reader.readInt32LE();
      var hotspot_x = reader.readInt32LE();
      var hotspot_y = reader.readInt32LE();
      frame.hotspot = $V([hotspot_x, hotspot_y]);

      framesInfo.push(info);
      this.frames.push(frame);
    }

    for (i = 0; i < numFrames; i++) {
      info = framesInfo[i];
      frame = this.frames[i];
      reader.seek(info.outlineTableOffset);
      for (j = 0; j < frame.height; j++) {
        row = new SlpRow();
        row.left = reader.readUInt16LE();
        row.right = reader.readUInt16LE();
        row.commands = [];
        frame.rows.push(row);
      }
    }

    for (i = 0; i < numFrames; i++) {
      frame = this.frames[i];
      info = framesInfo[i];

      reader.seek(info.cmdTableOffset);
      info.offsets = new Uint32Array(frame.height);
      for (j = 0; j < frame.height; j++) {
        info.offsets[j] = reader.readUInt32LE();
      }

      reader.seek(info.cmdTableOffset + 4 * frame.height);
      for (j = 0; j < frame.height; j++) {

        var eor = false;
        reader.seek(info.offsets[j]);
        while (!eor) {
          var cmd = {};
          cmd.byte =  reader.readUInt8();
          cmd.code = cmd.byte & 0x0f;
          if (cmd.code == 0x0E) {
            cmd.code = cmd.byte;
          }
          cmd.count = this.getCount(cmd, reader);
          cmd.data = this.getData(cmd, reader);

          frame.rows[j].commands.push(cmd);
          eor = cmd.code == 0x0F;
        }

      }

    }
    file.close();
  }

  getCount(cmd, reader) {
    var pixelCount;
    switch (cmd.code) {
      case 0x00: case 0x04: case 0x08: case 0x0c:
        return cmd.byte >> 2;
      case 0x01: case 0x05: case 0x09: case 0x0d:
        pixelCount = cmd.byte >> 2;
        if (pixelCount == 0) {
          pixelCount = reader.readUInt8();
        }
        return pixelCount;
      case 0x02: case 0x03:
        var byte = reader.readUInt8();
        return ((cmd.byte & 0xf0) << 4) + byte;
      case 0x06: case 0x07: case 0x0A: case 0x0B:
        pixelCount = cmd.byte >> 4;
        if (pixelCount == 0) {
          pixelCount = reader.readUInt8();
        }
        return pixelCount;
      case 0x4e: case 0x6e:
        return 1;
      case 0x5e: case 0x7e:
        return reader.readUInt8();
      default:
        // console.log("unknow count " + cmd.code);
        return 0;
    }
  }

  getData(cmd, reader) {
    switch (cmd.code) {
      case 0x00: case 0x02: case 0x04: case 0x08: case 0x0c: case 0x06:
        return reader.readBytes(cmd.count);
      case 0x07: case 0x0A:
        return reader.readUInt8();
      default:

    }
    return null;
  }

  load(colors) {
    this.frames.forEach((frame) => {
      frame.load(colors);
    });
  }

  draw(pos, orientation, frame, player, ctx) {
    if (this.frames[frame]) {
      this.frames[frame].draw(pos, player, ctx);
    }
  }

  canClick(pos, frame) {
    return this.frames[frame].canClick(pos);
  }

  nextFrame(n, orientation) {
    return n < this.frames.length - 1 ? n + 1 : 0;
  }


};
