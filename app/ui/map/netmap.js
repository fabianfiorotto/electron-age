const MapView = require('./map');

module.exports = class MapNetView extends MapView {

  bindSocket(socket, protocol) {
    this.socket = socket;
    this.protocol = protocol;
  }

  rightClick(v) {
    let thePackage = protocol.createPackage();
    thePackage.command =  protocol.createAction();

    let action = protocol.createPrimary();

    let target = this.map.clickEntity(v);
    if (target) {
      action.target_id = target.id;
    }

    action.player_id = this.player.id

    action.x_coord = v.e(1);
    action.y_coord = v.e(2);

    action.selected_ids = [];
    action.selection_count = this.map.selected.length;
    for (let entity of this.map.selected) {
      action.selected_ids.push(entity.id)
    }

    thePackage.command.action = action;
    protocol.sendPackage(this.socket, thePackage);
    super.rightClick(v);
  }

  operationInit(control) {
    let thePackage = protocol.createPackage();
    thePackage.command =  protocol.createAction();
    let action = protocol.createGeneric(control.name);

    action.selected_ids = [];
    action.selection_count = this.map.selected.length;
    for (let entity of this.map.selected) {
      action.selected_ids.push(entity.id)
    }

    thePackage.command.action = action;

    protocol.sendPackage(this.socket, thePackage);

    return super.operationInit(control);
  }

}
