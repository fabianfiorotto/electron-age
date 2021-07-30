const DataPackage = require('../../binary/data_package');
const {Int8, Int16LE,  Int32LE, FloatLE, ArrayData} = DataPackage;

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
      selected_ids: ArrayData({
        type: Int32LE,
        length: (that) => that.selection_count,
        condition: (that) => that.selection_count < 0xFF
      })
    }
  }

  perform(map) {
    for (var i = 0; i < this.selection_count; i++) {
      let selected = map.entityById(this.selected_ids[i]);
      let f = map.formationPos(i);
      selected.setTargetPos(this.pos().add(f));
    }
  }

}
