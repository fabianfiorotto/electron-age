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

  static SHELTER = Symbol('unit_action_shelter');

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
    this.getModel()?.draw(camera);
  }

  drawSelection(camera) {
    resources.drawCircle(this.pos.subtract(camera), 20);
  }

  drawHitpoints(camera) {
    var v = this.pos.subtract(camera).subtract($V([20, 60]));
    resources.drawHitpoints(v ,this.properties.hitPoints / this.properties.maxHitPoints, this.player.id);
  }

  walk() {
    if (this.target && this.canReachTarget()){
      this.path = [];
      this.setState(Unit.IDLE);
      this.targetReached();
      return;
    }

    if (!this.path.length) {
      return;
    }
    var v = this.path[0].subtract(this.pos);
    if (v.modulus() > 1.0) {
      let newPos = this.pos.add(v.toUnitVector());
      if (!this.map.areThereAnyObstacle(this.pos, newPos, false, this)) {
        this.pos = newPos;
        this.player.emitter.emit('did-entity-moved', this);
      }
      else {
        this.path = [];
        this.setState(Unit.IDLE);
        // Avoid Deadlock
        // var path = this.map.pathfinder.find(this.pos, this.path[this.path.length - 1]);
        // this.setPath(path);
      }
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
  }

  attack() {
    if (!this.canReachTarget()) {
      this.setState(Unit.IDLE);
      return;
    }
    if (this.target.properties.hitPoints <= 0) {
      this.setState(Unit.IDLE);
      this.target.onEntityDestroy();
      return;
    }
    var projectileClass = this.getProjectileClass();
    if (projectileClass) {
      this.map.addEntity(projectileClass.fire(this));
    }
    else {
      let damage = this.attackMeleeDamage(this.target);
      this.target.decProperty({hitPoints: damage});
    }
  }

  onEntityCreated() {
    if (!this.isType(EntityType.LIVESTOCK)) {
      this.player.population++;
      this.player.emitter.emit('did-change-population', this.player);
    }
  }

  onEntityDestroy() {
    if (this.isAlive()) {
      if (!this.isType(EntityType.LIVESTOCK)) {
        this.player.population--;
        this.player.emitter.emit('did-change-population', this.player);
      }
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
    // aca depende porque las unidades que atacan a distancia tienen mas alcance
    // los aldeanos por ejemplo pueden alcanzar ciervos de lejos pero arboles no
    let v;

    if (this.path.length) {
      v = this.path[0].subtract(this.pos).toUnitVector();
    }
    else {
      v = $V([Math.cos(this.orientation), -Math.sin(this.orientation)]);
    }
    return this.target.isAt(this.pos.add(v));
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
    if (this.isEnemy(this.target)) {
      this.setState(Unit.ATTACKING);
    }
    else if (this.clickAction == Unit.SHELTER && this.target.canGarrison(this)) {
      this.target.garrison(this);
      this.clickAction = null;
    }
  }

  update() {

    this.each(40 / this.properties.speed, 'walk' , () => {
      if (this.state == Unit.WALKING) {
        this.walk();
      }
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
    return this.getModel().nextFrame();
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

  getCursorFor(entity) {
    return this.isEnemy(entity) ? 'attack' : 'default';
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

  defineDashboardControls() {
    return {
      main: [
        "unit1", "unit2", "unit3", "kill", null,
        "unit5", "unit6", "unit7", "stop",
      ]
    };
  }

  defineControls() {
    // var icons = resources.icons.military;
    var icons = this.icons;
    return {
      unit1: {
        icon: icons.unit1,
        callback: this.notDefined
      },
      unit2: {
        icon: icons.unit2,
        callback: this.notDefined
      },
      unit3: {
        icon: icons.unit3,
        callback: this.notDefined
      },
      kill: {
        icon: icons.kill,
        callback: this.notDefined
      },
      unit5: {
        icon: icons.unit5,
        callback: this.notDefined
      },
      unit6: {
        icon: icons.unit6,
        callback: this.notDefined
      },
      unit7: {
        icon: icons.unit7,
        callback: this.notDefined
      },
      stop: {
        icon: icons.stop,
        callback: this.notDefined
      },
    };
  }

};
