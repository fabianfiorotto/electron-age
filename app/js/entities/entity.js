const {Emitter} = require('event-kit');

module.exports = class Entity {

  /* jshint ignore:start */
  static CIVIL        = Symbol('entity_civil'); //??
  static CAVALRY      = Symbol('entity_cavalry');
  static CAMEL        = Symbol('entity_camel');
  static INFANTRY     = Symbol('entity_infantry');
  static ARCHER       = Symbol('entity_archer');
  static BUILDING     = Symbol('entity_building');
  static SHIP         = Symbol('entity_ship');
  static SIEGE_WEAPON = Symbol('entity_siege_weapon');
  static DEFENSIVE_STRUCTURE = Symbol('entity_defensive_structure');
  /* jshint ignore:end */

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
    this.queue = [];

    this.properties = this.defineProperties();
    this.types = this.defineTypes();
    this.updateProperties();
    this.player.onDidChangeAge(() => this.updateProperties());

    this.attackBonuses = this.defineAttackBonuses();
    this.defensiveBonuses = this.defineDefensivekBonuses();

    var upgrades = this.upgradesTo();
    if (Object.entries(upgrades).length !== 0) {
      player.onDidDevelopTechnology((tec) => {
        if (upgrades[tec]) {
          this.upgrade(upgrades[tec]);
        }
      });
    }
    this.initialize();
  }

  initialize() {
    //Use this instead of constructor to avoid mothod sign
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

  defineTypes() {
    return [];
  }

  defineAttackBonuses() {
    return [];
  }

  defineDefensivekBonuses() {
    return [];
  }

  updateProperties() {
  }

  setPath(path) {
  }

  validTargetPos(pos) {
    return this.map.terrain.isLand(pos);
  }

  setTargetPos(pos) {
  }

  setTarget(entity) {
    this.target = entity;
    if (entity && this.canReachTarget()) {
      this.targetReached();
    }
  }

  canReachTarget(){
    return false;
  }

  targetReached() {
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

  getModels() {
    // Test
    return [];
  }

  getModel() {
    return null;
  }

  getFrame() {
    return this.frame;
  }

  minAge(){
    return 1;
  }

  isType() {
    return this.types.some((type) => [...arguments].includes(type));
  }

  develop(tec) {
    let technology;
    if (this[tec + 'Technology']) {
      technology = this[tec + 'Technology']();
    }
    this.player.develop(tec, technology);
  }

  techCondition(minAge, tec, prevTec) {
    let technologies = this.player.technologies;
    return this.player.age >= minAge && (!prevTec || technologies[prevTec]) && !technologies[tec];
  }

  defineControls() {
    return {};
  }

  getControls() {
    return this.defineControls();
  }

  getProjectileClass() {
    return null;
  }

  defineDashboardControls() {
    return {main: []};
  }

  _upgradeControl(controls, control) {
    if (!control) {
      return null;
    }
    if (control.update && controls[control.upgrade]) {
      let upgraded = this._upgradeControl(controls, controls[control.upgrade]);
      if (upgraded) {
        return upgraded;
      }
    }
    if (!control.condition || control.condition()) {
      return control;
    }
    else {
      return null;
    }
  }

  getDashboardControls(menu) {
    return this.player.getDashboardControls(menu, this);
  }

  buildDashboardControls(menu, controls) {
    let dashboardControls = this.defineDashboardControls()
    return dashboardControls[menu].map((c) => this._upgradeControl(controls, controls[c]));
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

  incMaxHitPointsPerc(value) {
    let prop = this.properties;
    let oldValue = prop.maxHitPoints;
    prop.maxHitPoints += Math.floor(
      value * prop.maxHitPoints / 100
    );
    prop.hitPoints = Math.floor(
      prop.hitPoints * prop.maxHitPoints / oldValue
    );
    this.emitter.emit('did-change-properties', prop);
  }

  incProperty(values) {
    for (const [key,value] of Object.entries(values)){
      this.properties[key] += value;
    }
    if (this.properties.hitPoints > this.properties.maxHitPoints) {
      this.properties.hitPoints = this.properties.maxHitPoints
    }
    this.emitter.emit('did-change-properties', this.properties);
  }

  decProperty(values){
    for (const [key,value] of Object.entries(values)){
      this.properties[key] = Math.max(0, this.properties[key] - value);
    }
    this.emitter.emit('did-change-properties', this.properties);
  }

  setProperty(values) {
    for (const [key,value] of Object.entries(values)){
      this.properties[key] = value;
    }
    this.emitter.emit('did-change-properties', this.properties);
  }


  transfer(entity, quantities, revert = false) {
    for (const [key,quantity] of Object.entries(quantities)){
      if (revert) {
        if (entity) {
          entity.resources[key] -= quantity;
        }
        this.resources[key] += quantity;
      }
      else {
        if (entity) {
          entity.resources[key] += quantity;
        }
        this.resources[key] -= quantity;
      }
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

  isAtVec(pos1, pos2, target = false) {
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
    var ages = this.player.getAgeCodes(this.minAge());
    for (var i = 0; i < ages.length; i++) {
      var age = ages[i];
      if (civres[age] && civres[age][name]) {
        for (const [key,value] of Object.entries(civres[age][name])){
          if (key == 'sail') { //HACK?
            res.unit[key] = value;
          }
          else {
            res.model[key] = value;
          }
        }
      }
    }
    res.player_id = this.player.id;
    return res;
  }

  iconsResources() {
    return [];
  }

  technologyIcons() {
    return {};
  }

  unitsIcons() {
    return {};
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

  onEntityCreated() {
  }

  onEntityDestroy() {
  }

  destroy() {
    this.emitter.dispose();
  }

  operationCancel(i) {
    if (Number.isInteger(i)) {
      if (this.queue[i].cost) {
        this.player.transfer(null, this.queue[i].cost, true);
      }
      this.queue.splice(i, 1);
      this.emitter.emit('did-operation-queue-changed', this.queue);
    }
    else {
      if (this.operation.cost) {
        this.player.transfer(null, this.operation.cost, true);
      }
      clearInterval(this.operation.timeout);
      clearInterval(this.operation.interval);
      this.operationComplete();
    }
  }

  operationPerform(operation) {
    operation.callback.call(this);
  }

  operationInit(control) {
    if (control.cost && !this.player.canAfford(control.cost)) {
      return false;
    }
    if (control.cost) {
      this.player.transfer(null, control.cost);
    }
    if (this.operation) {
      this.queue.push(control);
      this.emitter.emit('did-operation-queue-changed', this.queue);
    }
    else if (control.time){
      control.step = 0;
      this.operation = control;
      if (typeof control.prepare === "function") {
        control.prepare.call(this);
      }
      control.interval = setInterval(() => this.operationStep(), 1000);
      control.timeout  = setTimeout(()=> {
        clearInterval(control.interval);
        this.operationPerform(control);
        this.operationComplete();
      }, control.time * 1000);
      this.emitter.emit('did-operation-init', control);
    }
    else {
      this.operationPerform(control);
    }
    return true;
  }

  onOperationInit(callback){
    return this.emitter.on('did-operation-init', callback);
  }
  operationStep() {
    this.operation.step++;
    this.emitter.emit('did-operation-step', this.operation);
  }
  onOperationStep(callback) {
    return this.emitter.on('did-operation-step', callback);
  }
  onOperationQueueChanged(callback) {
    return this.emitter.on('did-operation-queue-changed', callback);
  }

  operationComplete() {
    this.emitter.emit('did-operation-complete', this.operation);
    this.operation = null;
    if (this.queue.length) {
      this.operationInit(this.queue.shift());
      this.emitter.emit('did-operation-queue-changed', this.queue);
    }
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

  debugger() {
    /* jshint ignore:start */
    debugger;
    /* jshint ignore:end */
  }
};
