const Entity = require('./entity');

module.exports = class Unit extends Entity {

/* jshint ignore:start */
  static IDLE      = Symbol('unit_idle');
  static WALKING   = Symbol('unit_walking');
  static ATTACKING = Symbol('unit_attacking');
  static DYING     = Symbol('unit_dying');
  static ROTTING   = Symbol('unit_rotting');
  static WORKING   = Symbol('unit_working');
/* jshint ignore:end */

  constructor(map, player) {
    super(map, player);
    this.path = [];
    this.pos = $V([50,100]);
    this.orientation = 3.14;
    this.state = Unit.IDLE;
  }

  setPath(path) {
    if (path.length > 0) {
      var v = path[0].subtract(this.pos);
      this.orientation = Math.atan2(-v.e(2), v.e(1));
      this.state = Unit.WALKING;
    }
    else {
      this.state = Unit.IDLE;
    }
    this.path = path;
    this.frame = 0;
  }

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.pos.subtract(camera), this.orientation, this.getFrame(), this.player.id);
    }
  }

  drawSelection(camera) {
    resources.drawCircle(this.pos.subtract(camera), 20);
  }

  drawHitpoints(camera) {
    var v = this.pos.subtract(camera).subtract($V([20, 50]));
    resources.drawHitpoints(v ,this.properties.hitPoints / this.properties.maxHitPoints, this.player.id);
  }

  walk() {
    if (this.path.length) {
      var v = this.path[0].subtract(this.pos);
      if (v.modulus() > 1.0) {
        this.pos = this.pos.add(v.toUnitVector());
      }
      else {
        this.frame = 0;
        this.path.shift();
        if (this.path.length == 0) {
          this.state = Unit.IDLE;
        }
      }
      if (this.target && this.canReachTarget()){
        this.path = [];
        this.state = Unit.IDLE;
        this.targetReached();
      }
    }
  }

  attack() {
    if (this.target.properties.hitPoints) {
      this.target.properties.hitPoints -= 1;
      this.target.emitter.emit('did-change-properties', this.target.properties);
    }
    else {
      this.state = Unit.IDLE;
      this.target.onEntityDestroy();
    }
  }

  onEntityDestroy() {
    this.state = Unit.DYING;
    this.frame = 0;
  }

  canReachTarget(){
    // aca depende porque las unicades de que atacan a distancia tienen mas alcance
    // los aldeanos por ejemplo pueden alcanzar ciervos de lejos pero arboles no
    return this.target.isAt(this.pos);
  }

  isAt(pos) {
    return this.pos.subtract(pos).modulus() < 50.0;
  }

  targetReached() {
    if (this.target.player.id != this.player.id) {
      this.state = Unit.ATTACKING;
    }
  }

  update() {

    this.each(50, 'walk' , () => {
      this.walk();
    });


    this.each(500, 'attack' , () => {
      if (this.state == Unit.ATTACKING) {
        this.attack();
      }
    });

    this.each(50, 'animation' , () => {
      if (this.getModel()) {
        var prevFrame = this.frame;
        this.frame = this.getModel().nextFrame(this.frame, this.orientation);
        if (this.state == Unit.ROTTING && prevFrame > this.frame) {
          this.map.removeEntity(this);
        }
        if (this.state == Unit.DYING && prevFrame > this.frame) {
          this.state = Unit.ROTTING;
        }
      }
    });

  }

  upgrade(entityClass) {
    var upgrade = new entityClass(this.map, this.player);
    upgrade.pos = this.pos;
    upgrade.orientation = this.orientation;
    upgrade.path = this.path;
    this.map.addEntity(upgrade);
    this.map.removeEntity(this);
  }


  getModel() {
    switch (this.state) {
      case Unit.WALKING:
        return this.models.walking;
      case Unit.DYING:
        return this.models.dying;
      case Unit.ATTACKING:
        return this.models.attacking;
      case Unit.ROTTING:
        return this.models.rotting;
      default:
        return this.models.stand;
    }
  }

  thumbnail() {
    return 0;
  }

  iconsResources() {
    return [
      {
        interface: 50730,
        frames: {
          thumbnail: this.thumbnail(),
        }
      },
      {
        interface: 50721,
        frames: {
          unit1:  6,
          unit2:  7,
          unit3:  8,
          kill:  59,
          unit5:  9,
          unit6: 10,
          unit7: 11,
          stop:   3,
        }
      }
    ];
  }

  modelsResources() {
    return {
      unit: {}
    };
  }

  controls() {
    // var icons = resources.icons.military;
    var icons = this.icons;
    return [
      {
        icon: icons.unit1,
        callback: this.notDefined
      },
      {
        icon: icons.unit2,
        callback: this.notDefined
      },
      {
        icon: icons.unit3,
        callback: this.notDefined
      },
      {
        icon: icons.kill,
        callback: this.notDefined
      },
      null,
      {
        icon: icons.unit5,
        callback: this.notDefined
      },
      {
        icon: icons.unit6,
        callback: this.notDefined
      },
      {
        icon: icons.unit7,
        callback: this.notDefined
      },
      {
        icon: icons.stop,
        callback: this.notDefined
      },
    ];
  }

};
