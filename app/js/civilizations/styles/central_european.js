module.exports = class CentralEuropean {

  modelsResources() {
    return {
      dark: {
        MiningCamp: {
          building: 3492
        },
        LumberCamp: {
          building: 3504
        }
      },
      feudal: {
        House: {
          building: 2232
        },
        Market: {
          building: 2275
        },
        Blacksmith: {
          building: 90,
          animation: 98
        },
        Barracks:{
          building: 130
        },
        ArcheryRange: {
          building: 21
        },
        Stable: {
          building: 1006
        }
      },
      castle: {
        Market: {
          building: 817
        },
        Monastery: {
          building: 278
        },
        University: {
          building: 3832
        },
        Castle: {
          building: 302
        },
        SiegeWorkshop: {
          building: 955
        }
      },
      imperial: {
        House: {
          building: 2244
        },
        Market: {
          building: 3794
        },
        Blacksmith: {
          building: 102
        },
        Barracks: {
          building: 142
        },
        ArcheryRange: {
          building: 33
        },
        Stable: {
          building: 1018
        }
      }
    };
  }

  async updateAge(age, entity) {
    var allres = this.modelsResources();
    var base_id = 50505;
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
