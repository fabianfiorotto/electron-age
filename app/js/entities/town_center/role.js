const Unit = require('../unit');

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
    var rType = this.resourceType;
    this.villager.each(500, 'work' , () => {
      if (this.villager.state == Unit.WORKING) {
        if (!this.villager.resources || !this.villager.resources[rType]) {
          this.villager.resources = {};
          this.villager.resources[rType] = 0;
        }
        if (this.villager.resources[rType] >= this.maxCarry) {
          this.villager.state = Unit.IDLE;
        }
        else {
          var berries = this.villager.target;
          var rTrans = {};
          rTrans[rType] = 1;
          berries.transfer(this.villager,rTrans);
        }
      }
    });
    if (this.villager.state == Unit.IDLE && this.isCarrying()) {
      this.villager.frame = 0;
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

};
