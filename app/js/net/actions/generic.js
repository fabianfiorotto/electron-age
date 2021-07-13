const DataPackage = require('../../binary/data_package');
const {UInt8, Int8, Int16LE,  Int32LE, FloatLE, BytesData} = DataPackage;

module.exports = class AoeNetGenericAction extends DataPackage {

  // This is not an actual aeo action
  // It is used to ensure that all features are accessible

  id() {
    return 0x0e; // Hope this id is available
  }

  static defineAttirbutes() {
    return {
      selection_count: Int8,
      selected_ids: {
        type: Int32LE,
        length: (that) => that.selection_count,
        condition: (that) => that.selection_count < 0xFF
      },
      actionNameLenght: UInt8,
      actionName: {
        type: UInt8,
        length: (that) => that.actionNameLenght,
        condition: (that) => that.actionNameLenght < 0xFF
      }
    }
  }

  unpack_actionName(value) {
    return Buffer.from(value).toString('utf8');
  }

  pack_actionName() {
    return Buffer.from(this.actionName, 'utf8');
  }

  pack_actionNameLenght() {
    return this.actionName.length;
  }


  perform(map) {
    for (var i = 0; i < this.selection_count; i++) {
      let selected = map.entityById(this.selected_ids[i]);
      let civilization = selected.player.civilization;
      let controls = civilization.getControls(selected);
      let control = controls[this.actionName];
      selected.operationInit(control);
    }
  }
}
