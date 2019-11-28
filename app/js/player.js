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
    this.tecnologies = {};


    this.emitter = new Emitter();

    this.id = id;

    this.onDidChangeAge(() => this.onChangeAge());
  }


  updgrateAge() {
    if (this.age < 4) {
      this.age++;
      this.emitter.emit('did-change-age', this.age);
    }
  }

  develop(tec) {
    this.tecnologies[tec] = true;
    this.emitter.emit('did-develop-tecnology', tec);
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

  onDidDevelopTecnology(callback) {
    return this.emitter.on('did-develop-tecnology', callback);
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
