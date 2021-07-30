const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, BytesData, ArrayData} = DataPackage;

module.exports = class AoeNetUngarrisonAction extends DataPackage {


  id() {
    return 0x6f;
  }

  static defineAttirbutes() {
    return {
      selection_count: Int8,
      zero: Int16,
      x_coord: Float,
      y_coord: Float,

      ungarrison_type: Int8,
      zero2: BytesData(24),
      release_id: Int32LE,

      selected_ids: ArrayData({
        type:  Int32LE,
        length : (that) => that.selection_count
      })
    }
  }
}
