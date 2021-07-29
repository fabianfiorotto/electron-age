module.exports = class ArrayData {

  // La idea es eliminar la opcion de if (type.length) en el DataPackage

  constructor(length, type) {
    this.length = length;
    this.type = type;
  }

  static of(args) {
    return new ArrayData(args.length, args.type);
  }

  getSize(thePackage) {
    return Number.isInteger(this.length) ? this.length : this.length(thePackage);
  }

  byteSize(thePackage) {
    return this.getSize(thePackage) * thePackage._byteSizeForType(this.type);
  }

  defaultValue(thePackage) {
    return []
  }

  read(reader, thePackage) {
    let array = [];
    let length = this.getSize(thePackage);
    for (let i = 0; i < length; i++) {
      array.push(thePackage._readType(reader, this.type));
    }
    return array;
  }

  write(writer, value, thePackage) {
    for (const aValue of value) {
      packange._writeType(writer, this.type, aValue);
    }
  }

}
