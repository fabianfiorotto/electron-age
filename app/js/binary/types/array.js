module.exports = class ArrayData {

  constructor(length, type , condition) {
    this.length = length;
    this.type = type;
    this.condition = condition
  }

  static of(args) {
    return new ArrayData(args.length, args.type, args.condition);
  }

  getSize(thePackage) {
    return Number.isInteger(this.length) ? this.length : this.length(thePackage);
  }

  byteSize(thePackage) {
    return this.getSize(thePackage) * this.type.byteSize(thePackage);
  }

  defaultValue(thePackage) {
    let length = this.getSize(thePackage);
    return Array.from({length}, (v, i) => this.type.defaultValue(thePackage));
  }

  read(reader, thePackage) {
    let array = [];
    if (typeof this.condition == 'function' && !this.condition(thePackage)) {
      return array;
    }
    let length = this.getSize(thePackage);
    for (let i = 0; i < length; i++) {
      array.push(this.type.read(reader, thePackage));
    }
    return array;
  }

  write(writer, value, thePackage) {
    for (const aValue of value) {
      this.type.write(writer, aValue, thePackage);
    }
  }

}
