module.exports = class BytesData {

  constructor(size) {
    this.size = size;
  }

  static ofSize(size) {
    return new BytesData(size);
  }

  byteSize() {
    return this.size;
  }

  defaultValue() {
    return Buffer.alloc(this.size);
  }

  read(reader) {
    return reader.readBytes(this.size);
  }

  write(writer, value) {
    writer.writeBytes(value);
  }

}
