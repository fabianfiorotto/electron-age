const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, ArrayData} = DataPackage;

module.exports = class AoeNetStopAction extends DataPackage {

  id() {
    return 0x01;
  }

  static defineAttirbutes() {
    return {
      selection_count: Int8,
      selected_ids: ArrayData({
        type: Int32LE,
        length: (that) => that.selection_count,
        condition: (that) => that.selection_count < 0xFF
      })
    }
  }
}
