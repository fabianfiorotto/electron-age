module.exports = class Terrain {

  constructor(width, height) {
    this.tiles = [];
    this.models = {};

    this.width = width;
    this.height = height;
    this.pos = $V([-650, 250]); //TODO remove
  }

  draw(camera) {
    var tcxt = resources.getTerrain2DContext();
    if (this.tiles.length) {
      for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
          var f = this.tiles[i][j];
          var w = f.width - 1, h = f.height - 1;
          var cell = $V([
            (i + j) * w / 2,
            (i - j) * h / 2
          ]);
          f.drawTerrain(this.pos.add(cell).subtract(camera));
        }
      }
    }
  }

  async loadResources(res) {
    this.models.grass = await res.loadTerrain(15009);
    this.models.grass.terrain_id = 0;
    this.models.grass.priority = 100;
    this.models.grass.load({
      base: resources.palettes[50505],
      player: 0
    });

    this.models.sand = await res.loadTerrain(15010);
    this.models.sand.terrain_id = 2;
    this.models.sand.priority = 80;
    this.models.sand.load({
      base: resources.palettes[50505],
      player: 0
    });

    for (var i = 0; i < this.width; i++) {
      this.tiles.push([]);
      for (var j = 0; j < this.height; j++) {
        var m;
        if (i > 10 && i < 20 && j > 10 && j < 20 ){
          m = this.models.sand;
        }
        else {
          m = this.models.grass;
        }

        var frame_id = (j % m.tc) + ((i % m.tc) * m.tc);
        this.tiles[i].push(m.frames[frame_id]);
      }
    }
  }
};
