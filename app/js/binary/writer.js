BinaryReader = require('./reader');

module.exports = class BinaryWriter extends BinaryReader {

  initBuffer(size) {
    this.buffer = Buffer.alloc(size);
    this.offset = 0;
  }

  writeInt8(value) {
    this.offset = this.buffer.writeInt8(value, this.offset);
  }

  writeUInt8(value) {
    this.offset = this.buffer.writeUInt8(value, this.offset);
  }

  writeInt16LE(value) {
    this.offset = this.buffer.writeInt16LE(value, this.offset);
  }

  writeUInt16LE(value) {
    this.offset = this.buffer.writeUInt16LE(value, this.offset);
  }

  writeInt32LE(value) {
    this.offset = this.buffer.writeInt32LE(value, this.offset);
  }

  writeUInt32LE(value) {
    this.offset = this.buffer.writeUInt32LE(value, this.offset);
  }

  writeFloatLE(value) {
    this.offset = this.buffer.writeFloatLE(value, this.offset);
  }

  writeString(value) {
    this.offset = this.buffer.write(value, this.offset);
  }

  writeBytes(value) {
    this.offset += Buffer.from(value).copy(this.buffer, this.offset);
  }

}
