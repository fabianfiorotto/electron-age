const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, BytesData} = DataPackage;

module.exports = class AoeNetPrimaryAction extends DataPackage {

  static defineAttirbutes() {
    return {
      action_identifier: Int8,
      player_id: Int8,
      zero: Int16LE,
      target_id: Int32LE,
      selection_count: Int8,
      zero2: BytesData(24),
      x_coord: FloatLE,
      y_coord: FloatLE,
    }
  }

  static defineFields() {
    return {
      selected_ids: {
        type: Int32LE,
        length: (data) => data.selection_count,
        condition: (data) => data.selection_count < 0xFF
      }
    }
  }

}
