const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, BytesData} = DataPackage;

module.exports = class AoeNetStopAction extends DataPackage {

  static defineAttirbutes() {
    return {
      // action_identifier: Int8,
      selection_count: Int8,
      selected_ids: {
        type: Int32LE,
        length: (that) => that.selection_count,
        condition: (that) => that.selection_count < 0xFF
      }
    }
  }
}
