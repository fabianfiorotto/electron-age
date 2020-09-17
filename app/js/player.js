const {Emitter} = require('event-kit');

module.exports = class Player {

  constructor(map, civilization, id) {
    this.map = map;
    this.civilization = civilization;
    this.resources = {
      food: 10000,
      wood: 10000,
      stone: 10000,
      gold: 10000
    };
    this.population = 0;
    this.maxPopulation = 0;
    this.age = 1;
    this.technologies = {};
    this.builderSpeedBonus = 0;

    this.emitter = new Emitter();

    this.id = id;

    this.onDidChangeAge(() => this.onChangeAge());
    this.onDidDevelopTechnology((tec) => this.onDevelopTechnology(tec));
  }


  updgrateAge() {
    if (this.age < 4) {
      this.age++;
      this.emitter.emit('did-change-age', this.age);
    }
  }

  develop(tec, technology = {}) {
    this.technologies[tec] = technology;
    this.emitter.emit('did-develop-technology', tec);
  }

  getDashboardControls(menu, entity) {
    return this.civilization.getDashboardControls(menu, entity);
  }

  onDidChangeResources(callback){
    return this.emitter.on('did-change-resources', callback);
  }

  onDidChangeAge(callback) {
    return this.emitter.on('did-change-age', callback);
  }

  onDidChangePopulation(callback) {
    return this.emitter.on('did-change-population', callback);
  }

  onDidDevelopTechnology(callback) {
    return this.emitter.on('did-develop-technology', callback);
  }

  getAgeCode(age) {
    switch (age || this.age) {
      case 1:
        return "dark";
      case 2:
        return "feudal";
      case 3:
        return "castle";
      case 4:
        return "imperial";
      default:
        return NULL;
    }
  }

  getAgeCodes(minAge = 1) {
    var codes = [];
    minAge = Math.max(this.age, minAge);
    for (var i = 1; i <= minAge; i++) {
      codes.push(this.getAgeCode(i));
    }
    return codes;
  }


  prepareToChangeAge() {
    var entities = this.map.getPlayerEntities(this);
    var age = this.getAgeCode(this.age + 1);
    for (var i = 0; i < entities.length; i++) {
      this.civilization.prepareToChangeAge(age, entities[i]);
    }
  }

  onChangeAge() {
    var entities = this.map.getPlayerEntities(this);
    var age = this.getAgeCode();
    for (var i = 0; i < entities.length; i++) {
      this.civilization.updateAge(age, entities[i]);
    }
  }

  onDevelopTechnology(tec) {
    let technology = this.technologies[tec];
    if (typeof technology.updatePlayer == "function") {
      technology.updatePlayer(this);
    }
    if (typeof technology.updateEntity == "function") {
      let entities = this.map.getPlayerEntities(this);
      for (var i = 0; i < entities.length; i++) {
        technology.updateEntity(entities[i]);
      }
    }
  }

  applyTechnologies(entity) {
    for (const [tec,technology] of Object.entries(this.technologies)){
      if (typeof technology.updateEntity == "function") {
        technology.updateEntity(entity);
      }
    }
  }

  canAfford(quantities) {
    var can = true;
    for (const [key,quantity] of Object.entries(quantities)){
      can &= this.resources[key] >= quantity;
    }
    return can;
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
    if (entity) {
      entity.emitter.emit('did-change-resources', entity.resources);
    }
  }

  destroy() {
    this.emitter.dispose();
  }

};
