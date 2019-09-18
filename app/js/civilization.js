module.exports = class Civilization {

  modelsResources() {
    return {};
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
        let model = await resources.loadModel(value);
        model.load({
          base: resources.palettes[50505],
          player: entity.player.id
        });
      }
    }
  }

};
