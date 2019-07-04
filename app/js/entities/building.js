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

  onEntityDestroy() {
    this.state = Building.DESTROYED;
  }

  canClick(pos) {
    var m = this.getModel();
    if (m) {
      var p = this.pos.subtract(pos);
      return m.canClick(p, 0);
    }
    return false;
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

  createUnit(unitClass) {
    var entity = new unitClass(this.map, this.player);
    entity.pos = this.pos;
    entity.setPath([this.spawnReunion]);
    this.map.addEntity(entity);
  }

};
