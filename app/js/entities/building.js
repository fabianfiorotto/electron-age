const Entity = require('./entity');

module.exports = class Building extends Entity {

  /* jshint ignore:start */
  static IMAGINARY   = Symbol('building_imaginary');
  static INCOMPLETE  = Symbol('building_incomplete');
  static FINISHED    = Symbol('building_finished');
  static DESTROYED   = Symbol('building_destroyed');
  static ATTACKING   = Symbol('building_attacking');
  /* jshint ignore:end */

  constructor(map, player) {
    super(map,player);
    this.spawnReunion = this.pos;
    this.focus = false;
    this.state = Building.FINISHED;
    this.finished = true;
    this.frame = 0;
    this.modelFrame = 0;

    this.attacking = false;
  }

  defineProperties() {
    //Estos son de la casa
    return {
      attack: 0,
      constructionTime: 25,
      hitPoints: 550,
      meleeArmor: 0,
      pierceArmor: 7,
      population: 0, //salvo este
      lineofSeight: 2,
    };
  }

  setTargetPos(pos) {
    if (this.validTargetPos(pos) ){
      this.spawnReunion = pos;
    }
  }

  setState(state) {
    this.state = state;
    if (state == Building.FINISHED && this.properties.population) {
      this.player.maxPopulation += this.properties.population;
      this.player.emitter.emit('did-change-population', this.player);
    }
    else if (state == Building.DESTROYED && this.properties.population) {
      this.player.maxPopulation -= this.properties.population;
      this.player.emitter.emit('did-change-population', this.player);
    }
  }

  click() {
    this.focus = true;
    if (this.sounds.click) {
      resources.playSound(this.sounds.click);
    }
  }

  drawSelection(camera) {
    resources.drawSquare(this.pos.subtract(camera), 100 * this.getSize());
  }

  drawShadow(camera) {
    if (this.models.shadow && this.state === Building.FINISHED) {
      this.models.shadow.draw(camera);
    }
  }

  draw(camera) {
    this.getModel()?.draw(camera);
    if (this.flagModel && this.focus) {
      this.flagModel.drawAt(this.spawnReunion.subtract(camera));
    }
    if (this.state === Building.FINISHED) {
      this.models.animation?.draw(camera);
      this.getFlames()?.draw(camera);
    }
  }

  getFlames() {
    let rate = this.properties.hitPoints / this.properties.maxHitPoints;
    if (this.getSize() == 2) {
      if(rate < 0.25) {
        return this.models.mediumFire3;
      } else if (rate < 0.50) {
        return this.models.mediumFire2;
      } else if (rate < 0.75) {
        return this.models.mediumFire1;
      }
    }
    else {
      if(rate < 0.25) {
        return this.models.fire6;
      } else if (rate < 0.50) {
        return this.models.fire4;
      } else if (rate < 0.75) {
        return this.models.fire1;
      }
    }
    return null;
  }

  drawMemory(camera, ctx) {
    this.getModel()?.draw(camera, ctx);
  }

  update() {

    this.each(500, 'attack' , () => {
      if (this.attacking) {
        this.attack();
      }
    });

    this.each(80, 'animation' , () => {
      this.models.shadow?.nextFrame();
      this.models.animation?.nextFrame();
      this.getFlames()?.nextFrame();
    });

    this.each(100, 'flagAnimation' , () =>{
      if (this.flagModel && this.focus) {
        this.flagModel.nextFrame();
      }
    });
  }

  canReachTarget() {
    return this.target.pos.subtract(this.pos).modulus() < 300.0;
  }

  targetReached() {
    if (this.target.player.id != this.player.id) {
      this.attacking = true;
    }
  }

  attack() {
    if (!this.canReachTarget()) {
      this.attacking = false;
      return;
    }
    if (this.target.properties.hitPoints) {
      var projectileClass = this.getProjectileClass();
      if (projectileClass && this.canReachTarget()) {
        this.map.addEntity(projectileClass.fire(this));
      }
    }
    else {
      this.attacking = false;
      this.target.onEntityDestroy();
    }
  }

  getModel() {
    if (this.state === Building.INCOMPLETE) {
      return this.models.marks;
    }
    if (this.state === Building.DESTROYED) {
      return this.models.debris;
    }
    else {
      return this.models.building;
    }
  }

  getSize() {
    return 1;
  }

  getControls() {
    if (this.minAge() > this.player.age ) {
      return {};
    }
    if (this.state === Building.FINISHED) {
      let controls = this.defineControls();

      for (const [name,control] of Object.entries(controls)){
        if (name.startsWith('create') && typeof control.population == 'undefined') {
          control.population = 1;
        }
      }
      return controls;
    }
    else {
      return {};
    }
  }

  getTilePoints() {
    var size = this.getSize();
    var y0 = 48 * size / 2 - 24;
    var points = [];
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        points.push(this.pos.subtract($V([
          (i - j) * 48,
          (i + j) * 24 - y0
        ])));
      }
    }
    return points;
  }

  overlap(entity) {
    var points1 = entity.getTilePoints();
    var points2 = this.getTilePoints();
    return points1.some((v1) => points2.some((v2) => v2.eql(v1)));
  }

  canPlace() {
    return !this.getTilePoints().some((tile) => this.map.terrain.isWater(tile));
  }

  onEntityCreated() {
    if (this.state == Building.FINISHED && this.properties.population) {
      this.player.maxPopulation += this.properties.population;
      this.player.emitter.emit('did-change-population', this.player);
    }
  }

  onEntityDestroy() {
    this.setState(Building.DESTROYED);
  }

  canClick(pos) {
    if (this.state === Building.INCOMPLETE) {
      return this.isAt(pos);
    }
    else {
      var m = this.getModel();
      if (m) {
        return m.canClick(pos);
      }
      return false;
    }
  }

  isAt(pos) {
    var p = this.pos.subtract(pos).map((e) => Math.abs(e));
    var size = this.getSize();
    var x = p.e(1), y = p.e(2);
    return  y < - 0.5 * x + 30 * size;
  }

  isAtVec(p1, p2, target = false) {
    if (this.isAt(p1)) {
      return false;
    }
    if (this.isAt(p2)) {
      return !target;
    }
    var size = this.getSize();

    var x1 = p1.e(1), y1 = p1.e(2);
    var x2 = p2.e(1), y2 = p2.e(2);

    var x = this.pos.e(1);
    var yy = this.pos.e(2);
    var y = (y2 - y1) * (x - x1) / (x2 - x1) + y1;
    var cond1 = y < yy + 25 * size && y > yy - 25 * size;

    y = this.pos.e(2);
    var xx = this.pos.e(1);
    x = (x2 - x1) * (y - y1) / (y2 - y1) + x1;
    var cond2 = x < xx + 50 * size  && x > xx - 50 * size;

    if (!cond1 && !cond2) {
      return false;
    }

    var pos = $V([xx, yy]);

    if (p1.distanceFrom(pos) > p1.distanceFrom(p2)) {
      return false;
    }

    var u1 = p2.subtract(p1).toUnitVector();
    var u2 = pos.subtract(p1).toUnitVector();


    return u1.angleFrom(u2) < Math.PI;
    // return u1.eql(u2);
  }

  modelsResources() {
    return {
      model: {
        flag: 3404
      }
    };
  }

  isImaginary() {
    return this.state === Building.IMAGINARY;
  }

  startBuilding() {
    this.state = Building.INCOMPLETE;
    this.frame = 0;
    this.properties.hitPoints = 1;
  }

  updateBuildingProcess() {
    let {hitPoints, maxHitPoints} = this.properties;
    this.models.marks.progressFrame(hitPoints / maxHitPoints);
  }

  iconsResources() {
    return [
      {
        interface: 50706,
        frames: {
          thumbnail: this.thumbnail(),
        }
      },
      {
        interface: 50730,
        frames: this.unitsIcons()
      },
      {
        interface: 50729,
        frames: this.technologyIcons()
      }
    ];
  }

  async loadResources(res) {
    var base_id = 50505;
    this.flagModel = await res.loadModelInstance(this, 3404);

    var mr = this.getModelsResources();
    var marks_id, debris_id;
    switch (this.getSize()) {
      case 1:
        marks_id  = 236;
        debris_id = 928;
        break;
      case 2:
        marks_id  = 237;
        debris_id = 929;
        break;
      case 3:
        marks_id  = 238;
        debris_id = 930;
        break;
      case 4:
        marks_id  = 239;
        debris_id = 931;
        break;
      case 5:
        marks_id  = 241;
        debris_id = 933;
        break;
    }
    if (marks_id && (!mr.model || !mr.model.marks)) {
      this.models.marks = await res.loadModelInstance(this, marks_id);
    }
    if (debris_id && (!mr.model || !mr.model.debris)) {
      this.models.debris = await res.loadModelInstance(this, debris_id);
    }

    for (var i = 0; i < 8; i++) {
      // 0..3 small
      // 4..5 medium
      // 6..8 large
      this.models['fire' + (i+1)] = await res.loadModelInstance(this, 424+i);
    }

    for (i = 0; i < 3; i++) {
      this.models['mediumFire' + (i+1)] = await res.loadModelInstance(this, 362+i);
    }

  }

  prepareUnit(unitClass) {
    this.operation.newUnit = new unitClass(this.map, this.player);
    resources.load(this.operation.newUnit);
  }

  createUnit(unitClass) {
    var entity, target;
    if (!unitClass && this.operation && this.operation.newUnit) {
      entity = this.operation.newUnit;
      this.operation.newUnit = null;
    }
    else {
      entity = new unitClass(this.map, this.player);
    }

    entity.pos = this.pos.add(
      this.spawnReunion
        .subtract(this.pos)
        .toUnitVector()
        .elementMultiply($V([48,24]))
        .multiply(this.getSize())
    );

    this.map.addEntity(entity);
    this.map.setEntityTargetPos(entity, this.spawnReunion);
  }

  ungarrison(entity) {
    if (this.garrisonedEntities.indexOf(entity) !== -1) {
      this.garrisonedEntities.splice(this.garrisonedEntities.indexOf(entity), 1);
      this.emitter.emit('did-change-selection', this.garrisonedEntities);

      entity.pos = this.pos.add(
        this.spawnReunion
          .subtract(this.pos)
          .toUnitVector()
          .elementMultiply($V([48,24]))
          .multiply(this.getSize())
      );

      this.map.addEntity(entity);
      this.map.setEntityTargetPos(entity, this.spawnReunion);
    }
  }

  defineTypes() {
    return [EntityType.BUILDING];
  }

};
