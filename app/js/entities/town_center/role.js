const Unit = require('../unit');
const TownCenter = require('./town_center');
const Mill = require('../mill/mill');
const MiningCamp = require('../resources/mining_camp');
const LumberCamp = require('../resources/lumber_camp');

module.exports = class VillagerRole {

  constructor(villager) {
    this.villager = villager;
    this.models = {};
    this.sounds = {};
  }

  isCarrying() {
    return this.villager.resources && this.villager.resources[this.resourceType] > 0;
  }

  update() {
    this.villager.each(500, 'work' , () => {
      if (this.villager.state == Unit.WORKING) {
        this.work();
      }
    });
  }

  work() {
    var rType = this.resourceType;
    if (!this.villager.resources || !this.villager.resources[rType]) {
      this.villager.resources = {};
      this.villager.resources[rType] = 0;
    }
    if (this.villager.resources[rType] >= this.maxCarry) {
      var warehouse = this.closestWarehouse();
      if (warehouse) {
        this.villager.setTarget(warehouse);
        this.villager.setTargetPos(warehouse.pos);
        this.villager.setState(Unit.WALKING);
      }
      else {
        this.villager.setState(Unit.IDLE);
      }
    }
    else {
      var berries = this.villager.target;
      var rTrans = {};
      rTrans[rType] = 1;
      berries.transfer(this.villager,rTrans);
    }
  }

  getFrame() {
    if (this.villager.state == Unit.IDLE && this.isCarrying()) {
      return 0;
    }
    else {
      return this.villager.frame;
    }
  }

  nextFrame() {
    if (this.villager.state == Unit.IDLE && this.isCarrying()) {
      return 0;
    }
    else {
      return this.getModel().nextFrame(this.villager.frame, this.villager.orientation);
    }
  }

  getModel() {
    switch (this.villager.state) {
      case Unit.WALKING:
        return this.isCarrying() ? this.models.carry : this.models.walking;
      case Unit.WORKING:
        return this.models.working;
      case Unit.ATTACKING:
        return this.models.attacking;
      case Unit.IDLE:
        return this.isCarrying() ? this.models.carry : this.models.stand;
      default:
        return this.models.stand;
    }
  }

  getModelsResources() {
    var res;
    if (this.villager.genre == "f") {
      res = this.femaleModelsResources();
    }
    else {
      res = this.maleModelsResources();
    }
    res.player_id = this.villager.player.id;
    return res;
  }

  async loadResources(res){

  }

  iconsResources() {
    return [];
  }

  onResourcesLoaded(){

  }

  targetReached() {
    var warehouse = this.villager.target;
    if (this.canStoreResources(warehouse)) {
      this.villager.transfer(this.villager.player, this.villager.resources);
    }
  }

  canStoreResources(warehouse) {
    var rType = this.resourceType;
    if (warehouse.player.id != this.villager.player.id) {
      return false;
    }
    if (warehouse instanceof TownCenter) {
      return true;
    }
    if (rType == 'food' && warehouse instanceof Mill) {
      return true;
    }
    if (rType == 'stone' && warehouse instanceof MiningCamp) {
      return true;
    }
    if (rType == 'wood' && warehouse instanceof LumberCamp) {
      return true;
    }
    return false;
  }

  closestWarehouse() {
    return this.villager.map.closest(this.villager.pos, 300, (e) => this.canStoreResources(e));
  }

};
