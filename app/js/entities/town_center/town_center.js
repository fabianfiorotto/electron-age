const Building = require('../building');
const Villager = require('./villager');

// require("sylvester");
// window.v1 = $V([0,95]);
// window.v2 = $V([0,50]);
// window.v3 = $V([0,70]);
module.exports = class TownCenter extends Building {

  getSize() {
    return 4;
  }

  draw(camera) {
    super.draw(camera);
    if (this.state == Building.FINISHED || this.state == Building.IMAGINARY) {
      var v1 = $V([0,95]), v2 = $V([0,50]), v3 = $V([0,70]);
      var pos = this.pos.subtract(camera);

      if(this.models.leftRoof){
        this.models.leftRoof.draw(pos.add(v1), 0, 0, this.player.id);
      }
      if(this.models.leftColumn1){
        this.models.leftColumn1.draw(pos.add(v2), 0, 0, this.player.id);
      }
      if(this.models.leftColumn2){
        this.models.leftColumn2.draw(pos.add(v3), 0, 0, this.player.id);
      }
      if(this.models.rightRoof){
        this.models.rightRoof.draw(pos.add(v1), 0, 0, this.player.id);
      }
      if(this.models.rightColumn1){
        this.models.rightColumn1.draw(pos.add(v3), 0, 0, this.player.id);
      }
      if(this.models.rightColumn2){
        this.models.rightColumn2.draw(pos.add(v2), 0, 0, this.player.id);
      }
    }
  }

  modelsResources() {
    return {
      model: {
        building: 891,
        leftRoof: 3594,
        leftColumn1: 3596,
        leftColumn2: 3595,

        rightRoof: 4610,
        rightColumn1: 4611,
        rightColumn2: 4612,
      },
      sounds: {
        click: 5123
      }
    };
  }

  iconsResources() {
    return [
      {
        interface: 50706,
        frames: {
          thumbnail: 28,
        }
      },
      {
        interface: 50729,
        frames: {
          age2: 30,
          age3: 31,
          age4: 32,
        }
      },
      {
        interface: 50730,
        frames: {
          villager: 15
        }
      }
    ];
  }

  controls() {
    var icons = this.icons;
    return [{
        icon: icons.villager,
        callback : () => this.createUnit(this.map.Villager)
      },
      {
        icon: this.nextAgeIcon(),
        callback : () => this.player.updgrateAge(),
        condition: () => this.player.age < 4
      }
    ];
  }

  nextAgeIcon() {
    switch (this.player.age) {
      case 1:
        return this.icons.age2;
      case 2:
        return this.icons.age3;
      default:
        return this.icons.age4;
    }
  }

};
