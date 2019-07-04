const {Emitter} = require('event-kit');

module.exports = class Player {

  constructor(map, civilization, id) {
    this.map = map;
    this.civilization = civilization;
    this.resources = {
      food: 0,
      wood: 0,
      stone: 0,
      gold: 0
    };
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
    this.emitter.on('did-change-resources', callback);
  }

  onDidChangeAge(callback) {
    this.emitter.on('did-change-age', callback);
  }

  onDidDevelopTecnology(callback) {
    this.emitter.on('did-develop-tecnology', callback);
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

  getAgeCodes() {
    var codes = [];
    for (var i = 1; i <= this.age; i++) {
      codes.push(this.getAgeCode(i));
    }
    return codes;
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

  transfer(entity, quantities) {
    for (const [key,quantity] of Object.entries(quantities)){
      if (entity) {
        entity.resources[key] += quantity;
      }
      this.resources[key] -= quantity;
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
