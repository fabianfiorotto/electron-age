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
    if (this.state == Building.FINISHED || this.state == Building.IMAGINARY) {
      super.draw(camera);

      this.models.leftRoof?.draw(camera);
      this.models.leftColumn1?.draw(camera);
      this.models.leftColumn2?.draw(camera);
      this.models.rightRoof?.draw(camera);
      this.models.rightColumn1?.draw(camera);
      this.models.rightColumn2?.draw(camera);
      this.models.floor?.draw(camera);
    }
    else {
      super.draw(camera);
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

  onResourcesLoaded() {
    this.models.building.pos = $V([0, -45]);

    var v1 = $V([0,50]), v2 = $V([0,25]);

    this.models.leftRoof.pos = v1;
    this.models.rightRoof.pos = v1;

    this.models.leftColumn2.pos = v2;
    this.models.rightColumn1.pos = v2;
  }

  thumbnail() {
    return 28;
  }

  technologyIcons() {
    return {
      age2: 30,
      age3: 31,
      age4: 32,
    };
  }

  unitsIcons() {
    return {
      villager: 15
    };
  }

  defineProperties() {
    return {
      attack: 5,
      range: 6,
      accuracy: 100,
      projectileSpeed: 7, //???
      guarrision: 15,
      constructionTime: 150,
      hitPoints: 2400,
      meleeArmor: 3,
      pierceArmor: 5,
      population: 5,
      lineofSeight: 8,
    };
  }

  defineDashboardControls() {
    return {
      main: [
        "createVillager", "upgradeAge"
      ],
    };
  }

  defineControls() {
    var icons = this.icons;
    return {
      createVillager: {
        icon: icons.villager,
        callback : () => this.createUnit(this.map.Villager)
      },
      upgradeAge: {
        time: 10,
        icon: this.nextAgeIcon(),
        prepare: () => this.player.prepareToChangeAge(),
        callback : () => this.player.updgrateAge(),
        condition: () => this.player.age < 4
      }
    };
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

  canClick(pos) {
    const {leftRoof, rightRoof, building} = this.models;
    if (this.state === Building.INCOMPLETE) {
      return this.isAt(pos);
    }
    else if (leftRoof && rightRoof && building) {
      return building.canClick(pos)
        || rightRoof.canClick(pos)
        || leftRoof.canClick(pos);
    }
    else {
      return false;
    }
  }

  canGarrison(entity) {
    return entity.isType(EntityType.CIVIL, EntityType.ARCHER);
  }

};
