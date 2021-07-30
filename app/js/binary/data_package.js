const StringData = require('./types/string');
const BytesData = require('./types/bytes');
const ArrayData = require('./types/array');
const SwitchData = require('./types/switch');
const PrimitiveData = require('./types/primitive');

module.exports = class DataPackage {

  static UInt8    = PrimitiveData.ofType(PrimitiveData.UInt8);
  static UInt16LE = PrimitiveData.ofType(PrimitiveData.UInt16LE);
  static UInt32LE = PrimitiveData.ofType(PrimitiveData.UInt32LE);
  static Int8     = PrimitiveData.ofType(PrimitiveData.Int8);
  static Int16LE  = PrimitiveData.ofType(PrimitiveData.Int16LE);
  static Int32LE  = PrimitiveData.ofType(PrimitiveData.Int32LE);
  static FloatLE  = PrimitiveData.ofType(PrimitiveData.FloatLE);

  static StringData  = StringData.ofSize;
  static BytesData   = BytesData.ofSize;
  static ArrayData   = ArrayData.of;
  static SwitchData  = SwitchData.of;

  static defineAttirbutes() {
    return {};
  }

  static getAttributes() {
    if (!this.attributes) {
      this.attributes = this.defineAttirbutes();
    }
    return this.attributes;
  }

  loadDefautValues() {
    let attributes = this.constructor.getAttributes();
    for (const [key,type] of Object.entries(attributes)) {
      this[key] = type.defaultValue(this);
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

  beforePack() {
  }

  afterUnpack() {
  }

  unpack(reader) {
    let attributes = this.constructor.getAttributes();
    for (const [key,type] of Object.entries(attributes)){
      let value = type.read(reader, this);

      if (typeof this['unpack_' + key ]  == 'function') {
        value = this['unpack_' + key ](value);
      }
      this[key] = value;
    }

    this.afterUnpack();
  }

  _preparePackage() {
    if (this.__packed) {
      return;
    }
    this.beforePack();

    let attributes = this.constructor.getAttributes();
    for (const [key,type] of Object.entries(attributes)){
      let value = this[key];
      if (typeof this['pack_' + key ]  == 'function') {
        this[key] = value = this['pack_' + key ]();
      }
      if (value && typeof value._preparePackage  == 'function') {
        value._preparePackage();
      }
    }
    this.__packed = true;
  }

  pack(writer) {
    this._preparePackage();
    let attributes = this.constructor.getAttributes();
    for (const [key,type] of Object.entries(attributes)){
      if (typeof type.condition == 'function' && !type.condition(this)) {
        continue;
      }

      let value = this[key];

      type.write(writer, value, this);
    }
  }

  byteSize() {
    this._preparePackage();
    let attributes = this.constructor.getAttributes();
    let size = 0;
    for (const [key,type] of Object.entries(attributes)) {
      if (this[key] && typeof this[key].byteSize == 'function') {
        size += this[key].byteSize();
      }
      else {
        size += type.byteSize(this);
      }
    }
    return size;
  }

  perform() {
  }

  pos() {
    return $V([this.x_coord, this.y_coord]);
  }

}
