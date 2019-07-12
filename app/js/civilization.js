module.exports = class Civilization {

  modelsResources() {
    return {};
  }

  async updateAge(age, entity) {
    var allres = this.modelsResources();
    var res = allres[age];
    var name = entity.constructor.name;
    if (res[name]) {
      for (const [key,value] of Object.entries(res[name])){
        entity.models[key] = await resources.loadModel(value);
        entity.models[key].load({
          base: resources.palettes[50505],
          player: entity.player.id
        });
      }
    }
  }

};
