const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, BytesData, ArrayData} = DataPackage;

module.exports = class AoeNetGarrisonAction extends DataPackage {


  id() {
    return 0x75;
  }

  static defineAttirbutes() {
    return {
      selection_count: Int8,
      zero: Int16,

      building_id: Int32LE,
      garrison_type: Int8,
      zero: BytesData(24),
      x_coord: FloatLE,
      y_coord: FloatLE,
      const: Int32LE,

      selected_ids: ArrayData({
        type:  Int32LE,
        length : (that) => that.selection_count
      })

    }
  }
}
