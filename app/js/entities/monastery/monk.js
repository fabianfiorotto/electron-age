const Unit = require('../unit');

module.exports = class Monk extends Unit {


  /* jshint ignore:start */
    static CONVERTION_START = Symbol('monk_convertion_start');
    static CONVERTING       = Symbol('monk_converting');
    static HEALING          = Symbol('monk_healing');
  /* jshint ignore:end */

  modelsResources() {
    return {
      unit: {
        attacking: 768,
        dying: 771,
        stand: 774,
        rotting: 775,
        walking: 779,

        converting: 768,
        healing: 776,
        carry: 3827,
        carring: 3831

      }
    };
  }

  defineProperties() {
    return {
      speed: 0.7,
      hitPoints: 30,
      attack: 1,
      meleeArmor: 0,
      pierceArmor: 0,
      lineofSeight: 11,
    };
  }

  getCursorFor(entity) {
    return this.isEnemy(entity) || entity.isType(EntityType.RELIC) ? 'convert' : 'default';
  }

  thumbnail() {
    return 33;
  }

  controlsIcons() {
    return {
      dropRelic: 16
    };
  }

  targetReachedWithRelic() {
    if (this.target.isType(EntityType.MONASTERY)) {
      this.target.garrison(this.relic);
      this.relic = null;
    }
  }

  targetReachedWithoutRelic() {
    if (this.target.isType(EntityType.RELIC)){
      this.pickRelic();
    }
    else if (this.isEnemy(this.target)) {
      if (!this.isConverting()) {
        this.setState(Monk.CONVERTION_START);
        this.convertion_starting = 0;
      }
    }
    else if (this.target.isWonded()) {
      this.setState(Monk.HEALING);
    }
    else {
      this.setState(Unit.IDLE);
    }
  }

  targetReached() {
    if (this.relic) {
       this.targetReachedWithRelic();
    }
    else {
      this.targetReachedWithoutRelic();
    }
  }

  attack() {
  }

  convertionStarting() {
    if (!this.canReachTarget()) {
      this.setState(Unit.IDLE);
      return;
    }
    if (this.convertion_starting == 5) {
      this.setState(Monk.CONVERTING);
    }
    else {
      this.convertion_starting += 1;
    }
  }

  convert() {
    if (!this.canReachTarget()) {
      this.setState(Unit.IDLE);
      return;
    }

    if (Math.random() < 0.33) {
      this.target.player = this.player;
      resources.load(this.target);
      this.setState(Unit.IDLE);
    }
  }

  dropRelic() {
    let v = $V([Math.cos(this.orientation), -Math.sin(this.orientation)]);
    this.relic.pos = this.pos.add(v.x(20.0));
    this.map.entities.push(this.relic);
    this.relic = null;
    this.setState(Unit.IDLE);
  }

  pickRelic() {
    this.relic = this.target;
    this.target = null;
    this.map.removeEntity(this.relic);
    this.setState(Unit.IDLE);
  }

  heal() {
    const t = EntityType;
    if (!this.target.isType(t.BUILDING, t.SHIP, t.SIEGE_WEAPON)) {
      this.target.incProperty({hitPoints: 1});
    }
  }

  isConverting() {
    return this.state == Monk.CONVERTING || this.state == Monk.CONVERTION_START;
  }

  canReachTarget() {
    if (this.relic || this.target.isType(EntityType.RELIC)) {
      return super.canReachTarget();
    }
    else {
      return this.target.pos.subtract(this.pos).modulus() < 100.0;
    }
  }

  update() {
    super.update();

    this.each(180, 'convert' , () => {
      if (this.state == Monk.CONVERTION_START) {
        this.convertionStarting();
      }
      if (this.state == Monk.CONVERTING) {
        this.convert();
      }
    });

    this.each(400, 'healing' , () => {
      if (this.state == Monk.HEALING) {
        this.heal();
      }
    });
  }

  defineDashboardControls() {
    if (this.relic) {
      return {
        main: ["dropRelic"]
      };
    }
    else {
      return {
        main: []
      };
    }
  }

  defineControls() {
    var icons = this.icons;
    return {
      dropRelic: {
        icon: icons.dropRelic,
        callback: () => this.dropRelic(),
      }
    }
  }

  getModel() {
    if (this.relic) {
      switch (this.state) {
        case Unit.WALKING:
          return this.models.carring;
        case Monk.IDLE:
          return this.models.carry;
        default:
          return super.getModel();
      }
    }
    else {
      switch (this.state) {
        case Monk.CONVERTION_START:
        case Monk.CONVERTING:
        return this.models.converting;
        case Monk.HEALING:
        return this.models.healing;
        default:
        return super.getModel();
      }
    }
  }


};
