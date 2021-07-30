const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, BytesData, ArrayData} = DataPackage;

module.exports = class AoeNetPrimaryAction extends DataPackage {


  id() {
    return 0x00;
  }

  static defineAttirbutes() {
    return {
      // action_identifier: Int8,
      player_id: Int8,
      zero: Int16LE,
      target_id: Int32LE,
      selection_count: Int8,
      zero2: BytesData(24),
      x_coord: FloatLE,
      y_coord: FloatLE,
      selected_ids: ArrayData({
        type: Int32LE,
        length: (that) => that.selection_count,
        condition: (that) => that.selection_count < 0xFF
      })
    }
  }
}
