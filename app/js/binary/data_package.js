const StringData = require('./types/string');
const BytesData = require('./types/bytes');

module.exports = class DataPackage {

  static UInt8    = Symbol("UInt8");
  static UInt16LE = Symbol("UInt16LE");
  static UInt32LE = Symbol("UInt32LE");
  static Int8     = Symbol("Int8");
  static Int16LE  = Symbol("Int16LE");
  static Int32LE  = Symbol("Int32LE");
  static FloatLE  = Symbol("FloatLE");

  static StringData  = StringData.ofSize;
  static BytesData   = BytesData.ofSize;

  static defineAttirbutes() {
    return {};
  }

  static getAttributes() {
    if (!this.attributes) {
      this.attributes = this.defineAttirbutes();
    }
    return this.attributes;
  }

  _readType(reader, type) {
    if (typeof type === 'symbol') {
      return reader['read' + type.description]();
    }
    else if (typeof type.read == 'function'){
      return type.read(reader);
    }
    else if (type.length) {
      let array = [];
      let length = Number.isInteger(type.length) ? type.length : type.length(this);
      for (let i = 0; i < length; i++) {
        array.push(this._readType(reader, type.type));
      }
      return array;
    }
    else {
      return this._readType(reader, type.type);
    }
  }

  _writeType(writer, type, value) {
    if (typeof type === 'symbol') {
      writer['write' + type.description](value);
    }
    else if (typeof type.write == 'function') {
      type.write(writer, value);
    }
    else if (type.length) {
      for (const aValue of value) {
        this._writeType(writer, type.type, aValue);
      } 
    }
    else {
      this._writeType(writer, type.type, value);
    }
  }


  static write(writer, value) {
    value.pack(writer);
  }

  static read(reader) {
    let instance = new this();
    instance.unpack(reader);
    return instance;
  }

  unpack(reader) {
    let attributes = this.constructor.getAttributes();
    for (const [key,type] of Object.entries(attributes)){

      if (typeof type.condition == 'function' && !type.condition(this)) {
        continue;
      }

      let value = this._readType(reader, type);

      if (typeof this['unpack_' + key ]  == 'function') {
        value = this['unpack_' + key ](value);
      }
      this[key] = value;
    }
  }

  pack(writer) {
    let attributes = this.constructor.getAttributes();
    for (const [key,type] of Object.entries(attributes)){

      if (typeof type.condition == 'function' && !type.condition(this)) {
        continue;
      }

      let value = this[key];
      if (typeof this['pack_' + key ]  == 'function') {
        value = instance['pack_' + key ]();
      }
      this._writeType(writer, type, value);
    }

  }

  static byteSize() {
    let attributes = this.getAttributes();
    let size = 0;
    for (const [key,type] of Object.entries(attributes)) {
      if (typeof type === 'symbol') {
        size += this._byteSizeForType(type);
      }
      else {
        size += type.byteSize();
      }
    }
    return size;
  }

  static _byteSizeForType(type) {
    switch (type) {
      case this.UInt8:
      case this.Int8:
        return 1;
      case this.UInt16LE:
      case this.Int16LE:
        return 2;
      case this.UInt32LE:
      case this.Int32LE:
      case this.FloatLE:
        return 4;
    }
  }

  byteSize() {
    let size = this.constructor.byteSize();

    // TODO solo instancia.

    return size;
  }

}
