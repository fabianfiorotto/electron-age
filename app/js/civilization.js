module.exports = class Civilization {

  modelsResources() {
    return {};
  }

  getDashboardControls(menu, entity) {
    // Extend to add extra elements to the dashboard.
    let controls = this.getControls(entity);
    return entity.buildDashboardControls(menu, controls);
  }

  getControls(entity) {
    // Extend to change prices creation time etc.
    return entity.getControls();
  }

  async updateAge(age, entity) {
    var allres = this.modelsResources();
    var res = allres[age];
    var name = entity.constructor.name;
    if (res[name]) {
      var models = {};
      for (const [key,value] of Object.entries(res[name])){
        models[key] = await resources.loadModel(value);
        models[key].load({
          base: resources.palettes[50505],
          player: entity.player.id
        });
      }
      for (const [key,value] of Object.entries(res[name])){
        entity.models[key] = models[key];
      }
    }
  }

  async prepareToChangeAge(age, entity) {
    var allres = this.modelsResources();
    var res = allres[age];
    var name = entity.constructor.name;
    if (res[name]) {
      for (const [key,value] of Object.entries(res[name])){
        let model;
        if (key == 'sail') { //HACK?
          model = await resources.loadUnit(value);
        }
        else {
          model = await resources.loadModel(value);
        }
        model.load({
          base: resources.palettes[50505],
          player: entity.player.id
        });
      }
    }
  }

};
