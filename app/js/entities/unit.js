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
    this.setState(Unit.IDLE);

    this.standing = 0;
  }

  setPath(path) {
    if (path.length > 0) {
      var v = path[0].subtract(this.pos);
      this.orientation = Math.atan2(-v.e(2), v.e(1));
      this.setState(Unit.WALKING);
    }
    else {
      this.setState(Unit.IDLE);
    }
    this.path = path;
  }

  setTargetPos(pos) {
    if (this.validTargetPos(pos) && this.isAlive()){
      var path = this.map.pathfinder.find(this.pos, pos);
      this.setPath(path);
    }
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
    var v = this.pos.subtract(camera).subtract($V([20, 60]));
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
          this.setState(Unit.IDLE);
        }
        else {
          v = this.path[0].subtract(this.pos);
          this.orientation = Math.atan2(-v.e(2), v.e(1));
        }
      }
      if (this.target && this.canReachTarget()){
        this.path = [];
        this.setState(Unit.IDLE);
        this.targetReached();
      }
    }
  }

  attack() {
    if (this.target.properties.hitPoints) {
      let damage = this.attackMeleeDamage(this.target);
      this.target.decProperty({hitPoints: damage});
    }
    else {
      this.setState(Unit.IDLE);
      this.target.onEntityDestroy();
    }
  }

  attackMeleeDamage(target) {
    // TODO collect bunus.
    var armor = target.properties.meleeArmor || 0;
    return Math.max(1, this.properties.attack - armor);
  }

  onEntityCreated() {
    this.player.population++;
    this.player.emitter.emit('did-change-population', this.player);
  }

  onEntityDestroy() {
    if (this.isAlive()) {
      this.setState(Unit.DYING);
    }
  }

  isAlive() {
    return this.state !== Unit.DYING && this.state !== Unit.ROTTING;
  }

  setState(state) {
    this.state = state;
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

  isAtVec(pos1, pos2, target = false) {
    if (this.isAt(pos1)) {
      return false;
    }
    if (this.isAt(pos2)) {
      return !target;
    }

    var p1 = pos1.subtract(this.pos);
    var p2 = pos2.subtract(this.pos);

    var d = p2.subtract(p1);

    if (d.modulus() < p1.modulus()) {
      return false;
    }

    var bigD = $M([
      p1.elements,
      p2.elements
    ])
    .transpose()
    .determinant();
    var d_sq = d.dot(d);
    return 50.0 ** 2 * d_sq > bigD;
  }

  targetReached() {
    if (this.target.player.id != this.player.id) {
      this.setState(Unit.ATTACKING);
    }
  }

  update() {

    this.each(40 / this.properties.speed, 'walk' , () => {
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
        this.frame = this.nextFrame();
        if (this.state == Unit.ROTTING && prevFrame > this.frame) {
          this.map.removeEntity(this);
        }
        if (this.state == Unit.DYING && prevFrame > this.frame) {
          this.onDied();
        }
        if (this.state == Unit.IDLE && prevFrame > this.frame) {
          if (this.standing > 0) {
            this.frame = prevFrame;
            this.standing--;
          }
          else {
            this.frame = 0;
            this.standing = 20;
          }
        }
      }
    });

  }

  nextFrame() {
    return this.getModel().nextFrame(this.frame, this.orientation);
  }

  onDied() {
    this.setState(Unit.ROTTING);
  }

  upgrade(entityClass) {
    var upgrade = new entityClass(this.map, this.player);
    upgrade.pos = this.pos;
    upgrade.orientation = this.orientation;
    upgrade.properties.hitPoints = Math.floor(
        this.properties.hitPoints
      * upgrade.properties.maxHitPoints
      / this.properties.maxHitPoints
    );
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
        frames: this.controlsIcons()
      }
    ];
  }

  controlsIcons() {
    return {
      unit1:  6,
      unit2:  7,
      unit3:  8,
      kill:  59,
      unit5:  9,
      unit6: 10,
      unit7: 11,
      stop:   3,
    };
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
