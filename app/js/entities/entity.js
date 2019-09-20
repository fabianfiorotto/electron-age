const {Emitter} = require('event-kit');

module.exports = class Entity {

  constructor(map, player) {
    this.map = map;
    this.player = player;
    this.frame = 0;
    this.models = {};
    this.sounds = {};
    this.icons = {};
    this.pos = $V([192,192]);
    this.eachLastRun = {};

    this.emitter = new Emitter();

    this.properties = this.defineProperties();


    var upgrades = this.upgradesTo();
    if (Object.entries(upgrades).length !== 0) {
      player.onDidDevelopTecnology((tec) => {
        if (upgrades[tec]) {
          this.upgrade(upgrades[tec]);
        }
      });
    }
  }

  defineProperties() {
    //Estos son del aldeano
    return {
      speed: 0.8,
      hitPoints: 100,
      maxHitPoints: 100,
      attack: 1,
      meleeArmor: 0,
      pierceArmor: 0,
      lineofSeight: 4,
    };
  }

  setPath(path) {
  }

  setTarget(entity) {
    this.target = entity;
  }

  drawShadow(camera) {
  }

  draw(camera) {
  }

  drawSelection(camera) {

  }

  drawHitpoints(camera) {
  }

  update() {
  }

  getModel() {
    return null;
  }

  getFrame() {
    return this.frame;
  }

  controls() {
    return [];
  }

  developControl(tec, minAge = 1) {
    return {
      icon: this.icons[tec],
      condition: () => this.player.age >= minAge && !this.player.tecnologies[tec],
      callback : () => this.player.develop(tec)
    };
  }

  developControlGroup(tecs) {
    var ctrls = [];
    var entries = Object.entries(tecs);
    var entires1 = entries.sort( (a,b) => a[1] == b[1] ? entries.indexOf(b) - entries.indexOf(a) : a[1] - b[1]);
    for (const [tec,minAge] of entires1) {
      ctrls.push(this.developControl(tec, minAge));
    }
    return ctrls;
  }

  getControls() {
    return this.controls();
  }

  upgradesTo() {
    return {};
  }

  upgrade(entityClass) {
    var upgrade = new entityClass(this.map, this.player);
    upgrade.pos = this.pos;
    this.map.addEntity(upgrade);
    this.map.removeEntity(this);
  }

  notDefined() {
    console.log("Not defined");
  }

  transfer(entity, quantities) {
    for (const [key,quantity] of Object.entries(quantities)){
      entity.resources[key] += quantity;
      this.resources[key] -= quantity;
    }
    this.emitter.emit('did-change-resources', this.resources);
    entity.emitter.emit('did-change-resources', entity.resources);
  }

  click() {

  }

  blur() {

  }

  canClick(pos) {
    var m = this.getModel();
    if (m) {
      var p = this.pos.subtract(pos);
      return m.canClick(p, this.getFrame());
    }
    return false;
  }

  isAt(pos) {
    return false;
  }

  modelsResources() {
    return {};
  }

  getModelsResources() {
    var res = this.modelsResources();
    if (!res.model) {
      res.model = {};
    }
    var civ = this.player.civilization;
    var civres = civ.modelsResources();
    var name = this.constructor.name;
    var ages = this.player.getAgeCodes();
    for (var i = 0; i < ages.length; i++) {
      var age = ages[i];
      if (civres[age] && civres[age][name]) {
        for (const [key,value] of Object.entries(civres[age][name])){
          res.model[key] = value;
        }
      }
    }
    res.player_id = this.player.id;
    return res;
  }

  iconsResources() {
    return [];
  }

  onDidChangeResources(callback){
    return this.emitter.on('did-change-resources', callback);
  }

  onDidChangeProperties(callback){
    return this.emitter.on('did-change-properties', callback);
  }

  onResourcesLoaded() {

  }

  async loadResources(res) {
  }

  onEntityDestroy() {
    console.log("DESTROY");
  }

  destroy() {
    this.emitter.dispose();
  }

  operationInit(control) {
    control.step = 0;
    this.operation = control;
    this.emitter.emit('did-operation-init', control);
  }
  onOperationInit(callback){
    return this.emitter.on('did-operation-init', callback);
  }
  operationStep() {
    this.operation.step++;
    this.emitter.emit('did-operation-step', this.operation);
  }
  onOperationStep(callback){
    return this.emitter.on('did-operation-step', callback);
  }
  operationComplete() {
    this.emitter.emit('did-operation-complete', this.operation);
    this.operation = null;
  }
  onOperationComplete(callback){
    return this.emitter.on('did-operation-complete', callback);
  }

  each(ms, name, callback) {
    var now = Date.now();
    if (!this.eachLastRun[name] || this.eachLastRun[name] + ms < now) {
      this.eachLastRun[name] = now;
      callback();
    }
  }

};
