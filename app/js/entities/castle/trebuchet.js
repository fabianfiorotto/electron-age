const Unit = require('../unit');
const Boulder = require('../projectiles/boulder');

module.exports = class Trebuchet extends Unit {

  /* jshint ignore:start */
    static ASSEMBLED   = Symbol('trebuchet_assembled');
    static PACKED      = Symbol('trebuchet_packed');
    static ASSEMBLING  = Symbol('trebuchet_assembling');
    static PACKING     = Symbol('trebuchet_packing');
  /* jshint ignore:end */

  initialize() {
    this.trebuchet_state = Trebuchet.PACKED;
  }

  modelsResources() {
    return {
      unit: {
        assembled_attacking: 1237,
        assembled_dying: 1241,
        assembled_stand: 1244,
        assembled_rotting: 1246,


        packed_dying: 4572,
        packed_rotting: 4573,
        packed_stand: 2279,
        packed_walking: 2279,
      },
      model: {
        marks: 237,
      }
    };
  }

  thumbnail() {
    // return 28; assembled // como se carga este?
    return 29;
  }

  controlsIcons() {
    return {
      attackPoint: 60,
      assemble: 13,
      disassemble: 12,
    };
  }

  setTrebuchetState(state) {
    this.frame = 0;
    this.trebuchet_state = state;
    this.path = [];
    if (Trebuchet.PACKING) {
      this.state = Unit.IDLE;
    }
  }

  defineDashboardControls() {
    return {
      main: [
        'assemble', 'disassemble', 'attackPoint'
      ]
    }
  }

  defineControls() {
    var icons = this.icons;
    return {
      assemble: {
       icon: icons.assemble,
       time: 5,
       prepare: () => this.setTrebuchetState(Trebuchet.ASSEMBLING),
       callback: () => this.setTrebuchetState(Trebuchet.ASSEMBLED)
      },
      disassemble: {
       icon: icons.disassemble,
       time: 5,
       prepare: () => this.setTrebuchetState(Trebuchet.PACKING),
       callback: () => this.setTrebuchetState(Trebuchet.PACKED)
      },
      attackPoint: {
       icon: icons.attackPoint,
       callback: this.notDefined
      },
    }
  }

  setTargetPos(pos) {
    if (this.trebuchet_state == Trebuchet.PACKED) {
      super.setTargetPos(pos);
    }
    else {
      var v = pos.subtract(this.pos);
      this.orientation = Math.atan2(-v.e(2), v.e(1));
    }
  }

  getFrame() {
    if (this.trebuchet_state == Trebuchet.PACKED && this.state == Unit.IDLE) {
      return 0;
    }
    else if (this.trebuchet_state == Trebuchet.PACKING || this.trebuchet_state == Trebuchet.ASSEMBLING) {
      return 0;
    }
    else {
      return super.getFrame();
    }
  }

  canReachTarget() {
    return this.trebuchet_state == Trebuchet.ASSEMBLED && this.target.pos.subtract(this.pos).modulus() < 800.0;
  }


  update() {
    super.update();
    this.each(50, 'fire_boulder' , () => {
      if (this.boulder && this.frame == 9) {
        this.map.addEntity(this.boulder);
        this.boulder = null;
      }
    });
  }

  attack() {
    if (this.target && this.target.properties.hitPoints) {
      if (!this.boulder) {
        this.boulder = new Boulder(this.map, this.player);
        this.boulder.pos = this.pos.subtract($V([0,210]));
        this.boulder.setTarget(this.target);
        // this.map.addEntity(boulder);
      }
    }
    else {
      this.setState(Unit.IDLE);
    }
  }


  getModel() {
    if (this.trebuchet_state == Trebuchet.PACKING || this.trebuchet_state == Trebuchet.ASSEMBLING) {
      return this.models.marks;
    }
    if (this.trebuchet_state == Trebuchet.ASSEMBLED) {
      switch (this.state) {
        case Unit.DYING:
          return this.models.assembled_dying;
        case Unit.ATTACKING:
          return this.models.assembled_attacking;
        case Unit.ROTTING:
          return this.models.assembled_rotting;
        default:
          return this.models.assembled_stand;
      }
    }
    else {
      switch (this.state) {
        case Unit.WALKING:
          return this.models.packed_walking;
        case Unit.DYING:
          return this.models.packed_dying;
        case Unit.ROTTING:
          return this.models.packed_rotting;
        default:
          return this.models.packed_stand;
      }
    }
  }


};
