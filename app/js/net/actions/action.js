const DataPackage = require('../../binary/data_package');
const {UInt32LE} = DataPackage;

const AoeNetPrimaryAction = require('./primary');
const AoeNetStopAction = require('./stop');
const AoeNetMoveAction = require('./move');
const AoeNetDeleteAction = require('./delete');
const AoeNetGenericAction = require('./generic');

module.exports = class AoeNetAction extends DataPackage {


  id() {
    return 0x3e;
  }

  beforePack() {
    this.action_identifier = this.action.id();
  }

  static defineAttirbutes() {
    const {Int8} = DataPackage;

    return {
      communication_turn: UInt32LE,
      individual_counter: UInt32LE,
      action_identifier: Int8,
      action: {
          switch: (that) => that.action_identifier,
          cases: {
            0x00: AoeNetPrimaryAction,
            0x01: AoeNetStopAction,
            0x03: AoeNetMoveAction,
            0x6a: AoeNetDeleteAction,

            0x0e: AoeNetGenericAction, // Not standard!
          }
        }
      }
    }

    perform(map) {
      this.action.perform(map);
    }
  }
