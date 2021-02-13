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

  static defineFields() {
    return {};
  }

  static getAttributes() {
    if (!this.attributes) {
      this.attributes = this.defineAttirbutes();
    }
    return this.attributes;
  }

  static getFields() {
    if (!this.fields) {
      this.fields = this.defineFields();
    }
    return this.fields;
  }


  _readType(reader, type) {
    if (typeof type === 'symbol') {
      return reader['read' + type.description]();
    }
    else if (typeof type.unpack == 'function'){
      return type.unpack(reader);
    }
    else {
      return type.read(reader);
    }
  }

  _writeType(writer, type, value) {
    if (typeof type === 'symbol') {
      writer['write' + type.description](value);
    }
    else if (value instanceof DataPackage) {
      value.pack(writer);
    }
    else {
      type.write(writer, value);
    }
  }


  static unpack(reader) {
    let instance = new this();
    instance.unpack(reader);
    return instance;
  }

  unpack(reader) {
    let attributes = this.constructor.getAttributes();
    for (const [key,value_type] of Object.entries(attributes)){
      let value = this._readType(reader, value_type);

      if (typeof this['unpack_' + key ]  == 'function') {
        value = this['unpack_' + key ](value);
      }
      this[key] = value;
    }
    this._unpackFields(reader)
  }

  _unpackFields(reader) {
    let fields = this.constructor.getFields();
    for (const [key, field] of Object.entries(fields)){
      if (typeof field.condition == 'function' && !field.condition(this)) {
        continue;
      }
      this[key] = [];
      let length = field.length(this);
      for (let i = 0; i < length; i++) {
        let value = this._readType(reader, field.type);
        if (typeof this['unpack_' + key ]  == 'function') {
          value = instance['unpack_' + key ]();
        }
        this[key].push(value);
      }
    }
  }

  pack(writer) {
    let attributes = this.constructor.getAttributes();
    for (const [key,value_type] of Object.entries(attributes)){
      let value = this[key];
      if (typeof this['pack_' + key ]  == 'function') {
        value = instance['pack_' + key ]();
      }
      this._writeType(writer, value_type, value);
    }

    this._packFields(writer);
  }


  _packFields(writer) {
    let fields = this.constructor.getFields();
    for (const [key, field] of Object.entries(fields)) {
      for (let i = 0; i < this[key].length; i++) {
        let value = this[key][i];
        if (typeof this['pack_' + key ]  == 'function') {
          value = instance['pack_' + key ]();
        }
        this._writeType(writer, field.type, value);
      }
    }
  }

  static byteSize() {
    let attributes = this.getAttributes();
    let size = 0;
    for (const [key,value_type] of Object.entries(attributes)) {
      if (typeof value_type === 'symbol') {
        size += this._byteSizeForType(value_type);
      }
      else {
        size += value_type.byteSize();
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

    let fields = this.constructor.getFields();
    for (const [key, field] of Object.entries(fields)) {
      if (typeof field.condition == 'function' && !field.condition(this)) {
        continue;
      }
      let length = field.length(this);
      let type_size = this.constructor._byteSizeForType(field.type); //esto solo funciona para primitivos
      size += length * type_size;
    }

    return size;
  }

}
