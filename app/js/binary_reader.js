module.exports = class BinaryReader {

  async loadFile(file) {
    var stat = await file.stat();
    var buffer = Buffer.alloc(stat.size);
    await file.read(buffer, 0, buffer.length, 0);
    this.loadBuffer(buffer);
  }

  loadBuffer(buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  seek(offset) {
    this.offset = offset;
  }

  readString(length) {
    var value = this.buffer.toString('utf8', this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  readBytes(length) {
    var value = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  readInt32LE() {
    var value = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  readUInt32LE() {
    var value = this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  readUInt16LE() {
    var value = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  readUInt8() {
    var value = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }

}
