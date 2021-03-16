const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, BytesData} = DataPackage;

module.exports = class AoeNetGarrisonAction extends DataPackage {


  id() {
    return 0x7e;
  }

  static defineAttirbutes() {
    return {
      zero: BytesData(24),
      monk_id: Int32LE,
    }
  }
}
