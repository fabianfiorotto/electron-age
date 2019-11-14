const Entity = require('./entity');

module.exports = class Building extends Entity {

  /* jshint ignore:start */
  static IMAGINARY   = Symbol('building_imaginary');
  static INCOMPLETE  = Symbol('building_incomplete');
  static FINISHED    = Symbol('building_finished');
  static DESTROYED   = Symbol('building_Destro');
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

  setPath(path) {
    if (path.length > 0) {
      this.spawnReunion = path[path.length - 1];
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

  onEntityDestroy() {
    this.state = Building.DESTROYED;
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
    this.flagModel = await res.loadModel(3404);
    switch (this.getSize()) {
      case 1:
        this.models.marks  = await res.loadModel(236);
        this.models.debris = await res.loadModel(928);
        break;
      case 2:
        this.models.marks  = await res.loadModel(237);
        this.models.debris = await res.loadModel(929);
        break;
      case 3:
        this.models.marks  = await res.loadModel(238);
        this.models.debris = await res.loadModel(930);
        break;
      case 4:
        this.models.marks  = await res.loadModel(239);
        this.models.debris = await res.loadModel(931);
        break;
      case 5:
        this.models.marks  = await res.loadModel(241);
        this.models.debris = await res.loadModel(933);
        break;
    }
    var base_id = 50505;
    this.flagModel.load({
      base: resources.palettes[base_id],
      player: this.player.id
    });
    this.models.marks.load({
      base: resources.palettes[base_id],
      player: this.player.id
    });
    this.models.debris.load({
      base: resources.palettes[base_id],
      player: this.player.id
    });
  }

  prepareUnit(unitClass) {
    this.operation.newUnit = new unitClass(this.map, this.player);
    resources.load(this.operation.newUnit);
  }

  createUnit(unitClass) {
    var entity;
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

    var path = this.map.pathfinder.find(entity.pos, this.spawnReunion);
    entity.setPath(path);
    this.map.addEntity(entity);
  }

};
