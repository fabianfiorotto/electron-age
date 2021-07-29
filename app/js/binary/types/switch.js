module.exports = class SwitchData {

  // La idea es eliminar la opcion de if (type.switch) en el DataPackage

  constructor(theSwitch, theCases, theDefault) {
    this.switch = theSwitch;
    this.cases = theCases;
    this.default = theDefault;
  }

  static of(args) {
    return new SwitchData(args.switch, args.cases, args.default);
  }

  defaultValue() {
    return this.cases[this.default];
  }

  read(reader, thePackage) {
    let key = this.switch(thePackage);
    return thePackage._readType(reader, this.cases[key] || this.default);
  }

  write(writer, value, thePackage) {
    let key = this.switch(thePackage);
    return thePackage._writeType(writer, this.cases[key] || this.default, value);
  }

}
