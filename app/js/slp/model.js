var SlpFrame = require('./frame');
var SlpRow = require('./row');

module.exports = class SlpModel {

  async loadFrames(file) {
    var stat = await file.stat();
    var buffer = Buffer.alloc(stat.size);
    await file.read(buffer, 0, buffer.length, 0);

    this.frames = [];
    var offset = {i: 0};

    var version = this.readString(buffer, 4, offset);
    var numFrames = this.readInt32LE(buffer, offset);
    var comment = this.readString(buffer, 24, offset);

    if (version != "2.0N") {
      console.log("Version " + version + " not supported: " + comment);
    }

    var i, j, info, frame, row;
    var framesInfo = [];
    this.frames = [];
    for (i = 0; i < numFrames; i++) {
      info = {};
      frame = new SlpFrame();

      info.cmdTableOffset = this.readUInt32LE(buffer, offset);
      info.outlineTableOffset = this.readUInt32LE(buffer, offset);
      info.paletteOffset = this.readUInt32LE(buffer, offset);
      info.properties = this.readUInt32LE(buffer, offset);

      frame.width = this.readInt32LE(buffer, offset);
      frame.height = this.readInt32LE(buffer, offset);
      var hotspot_x = this.readInt32LE(buffer, offset);
      var hotspot_y = this.readInt32LE(buffer, offset);
      frame.hotspot = $V([hotspot_x, hotspot_y]);

      framesInfo.push(info);
      this.frames.push(frame);
    }

    for (i = 0; i < numFrames; i++) {
      info = framesInfo[i];
      frame = this.frames[i];
      offset.i = info.outlineTableOffset;
      for (j = 0; j < frame.height; j++) {
        row = new SlpRow();
        row.left = this.readUInt16LE(buffer, offset);
        row.right = this.readUInt16LE(buffer, offset);
        row.commands = [];
        frame.rows.push(row);
      }
    }

    for (i = 0; i < numFrames; i++) {
      frame = this.frames[i];
      info = framesInfo[i];

      offset.i = info.cmdTableOffset;
      info.offsets = new Uint32Array(frame.height);
      for (j = 0; j < frame.height; j++) {
        info.offsets[j] = this.readUInt32LE(buffer, offset);
      }

      offset.i = info.cmdTableOffset + 4 * frame.height;
      for (j = 0; j < frame.height; j++) {

        var eor = false;
        offset.i = info.offsets[j];
        while (!eor) {
          var cmd = {};
          cmd.byte =  this.readUInt8(buffer, offset);
          cmd.code = cmd.byte & 0x0f;
          if (cmd.code == 0x0E) {
            cmd.code = cmd.byte;
          }
          cmd.count = this.getCount(cmd, buffer, offset);
          cmd.data = this.getData(cmd, buffer, offset);

          frame.rows[j].commands.push(cmd);
          eor = cmd.code == 0x0F;
        }

      }

    }
    file.close();
  }

  readString(buffer, length, offset) {
    var value = buffer.toString('utf8', offset.i, offset.i + length);
    offset.i += length;
    return value;
  }

  readInt32LE(buffer, offset) {
    var value = buffer.readInt32LE(offset.i);
    offset.i += 4;
    return value;
  }

  readUInt32LE(buffer, offset) {
    var value = buffer.readUInt32LE(offset.i);
    offset.i += 4;
    return value;
  }

  readUInt16LE(buffer, offset) {
    var value = buffer.readUInt16LE(offset.i);
    offset.i += 2;
    return value;
  }

  readUInt8(buffer, offset) {
    var value = buffer.readUInt8(offset.i);
    offset.i += 1;
    return value;
  }

  getCount(cmd, buffer, offset) {
    // var buffer = Buffer.alloc(1);
    var pixelCount;
    switch (cmd.code) {
      case 0x00: case 0x04: case 0x08: case 0x0c:
        return cmd.byte >> 2;
      case 0x01: case 0x05: case 0x09: case 0x0d:
        pixelCount = cmd.byte >> 2;
        if (pixelCount == 0) {
          pixelCount = this.readUInt8(buffer, offset);
        }
        return pixelCount;
      case 0x02: case 0x03:
        var byte = this.readUInt8(buffer, offset);
        return ((cmd.byte & 0xf0) << 4) + byte;
      case 0x06: case 0x07: case 0x0A: case 0x0B:
        pixelCount = cmd.byte >> 4;
        if (pixelCount == 0) {
          pixelCount = this.readUInt8(buffer, offset);
        }
        return pixelCount;
      case 0x4e: case 0x6e:
        return 1;
      case 0x5e: case 0x7e:
        return this.readUInt8(buffer, offset);
      default:
        // console.log("unknow count " + cmd.code);
        return 0;
    }
  }

  getData(cmd, buffer, offset) {
    switch (cmd.code) {
      case 0x00: case 0x02: case 0x04: case 0x08: case 0x0c: case 0x06:
        var slice = buffer.slice(offset.i, offset.i + cmd.count);
        offset.i += cmd.count;
        return slice;
      case 0x07: case 0x0A:
        return this.readUInt8(buffer, offset);
      default:

    }
    return null;
  }

  load(colors) {
    this.frames.forEach((frame) => {
      frame.load(colors);
    });
  }

  draw(pos, orientation, frame, player) {
    this.frames[frame].draw(pos, player);
  }

  canClick(pos, frame) {
    return this.frames[frame].canClick(pos);
  }

  nextFrame(n, orientation) {
    return n < this.frames.length - 1 ? n + 1 : 0;
  }


};
