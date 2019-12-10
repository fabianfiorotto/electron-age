const Entity = require('./entity');

module.exports = class Building extends Entity {

  /* jshint ignore:start */
  static IMAGINARY   = Symbol('building_imaginary');
  static INCOMPLETE  = Symbol('building_incomplete');
  static FINISHED    = Symbol('building_finished');
  static DESTROYED   = Symbol('building_destroyed');
  /* jshint ignore:end */

  constructor(map, player) {
    super(map,player);
    this.spawnReunion = this.pos;
    this.flagFrame = 0;
    this.focus = false;
    this.state = Building.FINISHED;
    this.finished = true;
    this.frame = 0;
    this.modelFrame = 0;
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

  blur() {
    this.focus = false;
  }

  drawSelection(camera) {
    resources.drawSquare(this.pos.subtract(camera), 100 * this.getSize());
  }

  drawShadow(camera) {
    if (this.models.shadow && this.state === Building.FINISHED) {
      this.models.shadow.draw(this.pos.subtract(camera), 0, this.frame, this.player.id);
    }
  }

  draw(camera) {
    var model = this.getModel();
    if (model) {
      model.draw(this.pos.subtract(camera), 0, this.getFrame(), this.player.id);
    }
    if (this.flagModel && this.focus) {
      this.flagModel.draw(this.spawnReunion.subtract(camera), 0, this.flagFrame, this.player.id);
    }
    if (this.state === Building.FINISHED && this.models.animation) {
      this.models.animation.draw(this.pos.subtract(camera), 0, this.frame, this.player.id);
    }
  }

  update() {

    this.each(80, 'animation' , () => {
      if (this.models.animation) {
        this.frame = this.models.animation.nextFrame(this.frame, 0);
      }
    });

    this.each(100, 'flagAnimation' , () =>{
      if (this.flagModel && this.focus) {
        this.flagFrame = this.flagModel.nextFrame(this.flagFrame, 0);
      }
    });
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

  getFrame() {
    var model = this.getModel();
    if (this.state === Building.INCOMPLETE && model) {
      return Math.floor(model.frames.length * this.properties.hitPoints / this.properties.maxHitPoints);
    }
    else {
      return this.modelFrame;
    }
  }

  getSize() {
    return 1;
  }

  getControls() {
    if (this.minAge() > this.player.age ) {
      return [];
    }
    if (this.state === Building.FINISHED) {
      return this.controls();
    }
    else {
      return [];
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
      var p = this.pos.subtract(pos);
      var m = this.getModel();
      if (m) {
        return m.canClick(p, 0);
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

    return cond1 || cond2;
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
        frames: this.tecnologyIcons()
      }
    ];
  }

  async loadResources(res) {
    var base_id = 50505;
    this.flagModel = await res.loadModel(3404);
    this.flagModel.load({
      base: resources.palettes[base_id],
      player: this.player.id
    });

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
      this.models.marks  = await res.loadModel(marks_id);
      this.models.marks.load({
        base: resources.palettes[base_id],
        player: this.player.id
      });
    }
    if (debris_id && (!mr.model || !mr.model.debris)) {
      this.models.debris = await res.loadModel(debris_id);
      this.models.debris.load({
        base: resources.palettes[base_id],
        player: this.player.id
      });
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

};
