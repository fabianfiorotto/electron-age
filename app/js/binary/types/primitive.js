module.exports = class PrimitiveData {

  static UInt8    = Symbol("UInt8");
  static UInt16LE = Symbol("UInt16LE");
  static UInt32LE = Symbol("UInt32LE");
  static Int8     = Symbol("Int8");
  static Int16LE  = Symbol("Int16LE");
  static Int32LE  = Symbol("Int32LE");
  static FloatLE  = Symbol("FloatLE");

  constructor(type) {
    this.type = type;
  }

  byteSize(thePackage) {
    switch (this.type) {
      case PrimitiveData.UInt8:
      case PrimitiveData.Int8:
        return 1;
      case PrimitiveData.UInt16LE:
      case PrimitiveData.Int16LE:
        return 2;
      case PrimitiveData.UInt32LE:
      case PrimitiveData.Int32LE:
      case PrimitiveData.FloatLE:
        return 4;
    }
  }

  static ofType(type) {
    return new PrimitiveData(type);
  }

  defaultValue(thePackage) {
    return 0
  }

  read(reader, thePackage) {
    return reader['read' + this.type.description]()
  }

  write(writer, value, thePackage) {
    writer['write' + this.type.description](value);
  }
}
