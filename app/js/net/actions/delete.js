const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, BytesData} = DataPackage;

module.exports = class AoeNetDeleteAction extends DataPackage {


  id() {
    return 0x6a;
  }

  static defineAttirbutes() {
    return {
      zero: BytesData(24),
      object_id: Int32LE,
      player_number: Int8,
      zero: BytesData(24),
    }
  }
}
