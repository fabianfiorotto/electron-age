module.exports = class StringData {

  constructor(size) {
    this.size = size;
  }

  static ofSize(size) {
    return new StringData(size);
  }

  byteSize() {
    return this.size;
  }

  read(reader) {
    return reader.readString(this.size);
  }

  write(writer, value) {
    writer.writeString(value);
  }

}
