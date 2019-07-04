module.exports = class CentralEuropean {

  modelsResources() {
    return {
      dark: {
        MiningCamp: {
          building: 3495
        },
        LumberCamp: {
          building: 3507
        }
      },
      feudal: {
        House: {
          building: 2235
        },
        Market: {
          building: 2278
        },
        Blacksmith: {
          building: 93,
          animation: 101
        },
        Barracks:{
          building: 133
        },
        ArcheryRange: {
          building: 24
        },
        Stable: {
          building: 1009
        }
      },
      castle: {
        Market: {
          building: 820
        },
        Monastery: {
          building: 281
        },
        University: {
          building: 3835
        },
        Castle: {
          building: 305
        },
        SiegeWorkshop: {
          building: 958
        }
      },
      imperial: {
        House: {
          building: 2247
        },
        Market: {
          building: 3797
        },
        Blacksmith: {
          building: 105
        },
        Barracks: {
          building: 145
        },
        ArcheryRange: {
          building: 36
        },
        Stable: {
          building: 1021
        }
      }
    };
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
