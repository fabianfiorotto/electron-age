module.exports = class SwitchData {

  constructor(theSwitch, theCases, theDefault) {
    this.switch = theSwitch;
    this.cases = theCases;
    this.default = theDefault;
  }

  static of(args) {
    return new SwitchData(args.switch, args.cases, args.default);
  }

  defaultValue() {
    if (!this.default) {
      return null;
    }
    this.default.defaultValue();
  }

  read(reader, thePackage) {
    let key = this.switch(thePackage);
    let type = this.cases[key] || this.default;
    return type.read(reader, thePackage);
  }

  write(writer, value, thePackage) {
    let key = this.switch(thePackage);
    let type = this.cases[key] || this.default;
    return type.write(writer, value, thePackage);
  }

}
