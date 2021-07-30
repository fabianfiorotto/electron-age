const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, ArrayData} = DataPackage;

module.exports = class AoeNetAttackGroundAction extends DataPackage {


  id() {
    return 0x6b;
  }

  static defineAttirbutes() {
    return {
      selection_count: Int8,
      zero: Int16,
      x_coord: Float,
      y_coord: Float,
      selected_ids: ArrayData({
        type:  Int32LE,
        length : (that) => that.selection_count
      })
    }
  }
}
