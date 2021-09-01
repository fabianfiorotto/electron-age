const DataPackage = require('../../binary/data_package');
const {UInt8, Int8, Int16LE,  Int32LE, FloatLE, ArrayData} = DataPackage;

module.exports = class AoeNetGenericAction extends DataPackage {

  // This is not an actual aeo action
  // It is used to ensure that all features are accessible

  id() {
    return 0x0e; // Hope this id is available
  }

  static defineAttirbutes() {
    return {
      selection_count: Int8,
      selected_ids: ArrayData({
        type: Int32LE,
        length: (that) => that.selection_count,
        condition: (that) => that.selection_count < 0xFF
      }),
      actionNameLenght: UInt8,
      actionName: ArrayData({
        type: UInt8,
        length: (that) => that.actionNameLenght,
        condition: (that) => that.actionNameLenght < 0xFF
      })
    }
  }

  setActionName(value) {
    this.actionName = Buffer.from(value, 'utf8');
    this.actionNameLenght = value.length;
  }

  getActionName() {
    return Buffer.from(this.actionName).toString('utf8');
  }

  perform() {
    let map = mapView.map;
    for (var i = 0; i < this.selection_count; i++) {
      let selected = map.entityById(this.selected_ids[i]);
      let civilization = selected.player.civilization;
      let controls = civilization.getControls(selected);
      let actionName = this.getActionName();
      let control = controls[actionName];
      selected.operationInit(control);
    }
  }
}
