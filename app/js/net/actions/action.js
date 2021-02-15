const { Int8 } = require('../sync/header');
const DataPackage = require('../../binary/data_package');

const Header = require('./header');
const AoeNetPrimaryAction = require('./primary');
const AoeNetStopAction = require('./stop');


module.exports = class AoeNetAction extends DataPackage {

  beforePack() {
    this.action_identifier = this.action.id();
  }

  static defineAttirbutes() {
    const {Int8} = DataPackage;

    return {
//        header: Hader,
      action_identifier: Int8,
      action: {
          switch: (that) => that.action_identifier,
          cases: {
            0x00: AoeNetPrimaryAction,
            0x01: AoeNetStopAction,
          }
        }
      }
    }
  }