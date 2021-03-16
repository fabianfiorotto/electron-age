const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, BytesData} = DataPackage;

module.exports = class AoeNetMoveAction extends DataPackage {


  id() {
    return 0x03;
  }

  static defineAttirbutes() {
    return {
      player_id: Int8,
      zero: Int16LE,
      const: Int32LE,
      selection_count: Int8,
      x_coord: FloatLE,
      y_coord: FloatLE,
      selected_ids: {
        type: Int32LE,
        length: (that) => that.selection_count,
        condition: (that) => that.selection_count < 0xFF
      }
    }
  }
}
