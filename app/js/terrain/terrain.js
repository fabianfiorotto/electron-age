const Blendomatic = require("../blendomatic/blendomatic");

module.exports = class Terrain {

  constructor(width, height) {
    this.tiles = [];
    this.create_tiles = Array.from({length: height}, ()=> new Array(width).fill('grass'));
    this.models = {};

    this.width = width;
    this.height = height;
    this.pos = $V([-650, 250]); //TODO remove

    this.blend_mask_lookup = [
      [ 2, 3, 2, 1, 1, 6, 5, 4 ],
      [ 3, 3, 3, 1, 1, 6, 5, 4 ],
      [ 2, 3, 2, 1, 1, 6, 1, 4 ],
      [ 1, 1, 1, 0, 7, 6, 5, 4 ],
      [ 1, 1, 1, 7, 7, 6, 5, 4 ],
      [ 6, 6, 6, 6, 6, 6, 5, 4 ],
      [ 5, 5, 1, 5, 5, 5, 5, 4 ],
      [ 4, 3, 4, 4, 4, 4, 4, 4 ]
    ];

    this.neighbor_lookup = [4, 3, 2, 5, 0, 7, 6, 1];
  }


  // https://github.com/SFTtech/openage/blob/6367e36dd828b6cf2b14591982aa3fda1b4dfd1a/libopenage/terrain/terrain.cpp#L500

  getNeighbors(i, j) {
    var w = this.width - 1;
    var h = this.height - 1;
    return [
      i < w && j < h ? this.tiles[i + 1][j + 1] : null,
      i < w          ? this.tiles[i + 1][j    ] : null,
      i < w && j > 0 ? this.tiles[i + 1][j - 1] : null,
               j > 0 ? this.tiles[i    ][j - 1] : null,
      i > 0 && j > 0 ? this.tiles[i - 1][j - 1] : null,
      i > 0          ? this.tiles[i - 1][j    ] : null,
      i > 0 && j < h ? this.tiles[i - 1][j + 1] : null,
               j < h ? this.tiles[i    ][j + 1] : null,
    ];
  }

  getInfluences(tile, neighbors) {
    var influences = {};
    for (var i = 0; i < neighbors.length; i++) {
      var k = this.neighbor_lookup[i];
      var neighbor = neighbors[i];
      if (neighbor && neighbor.terrain.priority > tile.terrain.priority && tile.terrain.terrain_id != neighbor.terrain.terrain_id) {
        if (k % 2 == 0) {
          var mask = (1 << ((k - 1) & 0x07)) | (1 << ((k + 1) & 0x07));

          if (influences[neighbor.terrain.terrain_id] & mask) {
            continue;
          }
        }
        influences[neighbor.terrain.terrain_id] |= 1 << k;
      }
    }
    return influences;
  }

  getInflueceMask(direction) {
    switch (direction) {
      case 0x0e:  //0b00001110
        return 16;
      case 0x38:  //0b00111000
        return 17;
      case 0xe0:  //0b11100000
        return 18;
      case 0x83:  //0b10000011
        return 19;
      default:
        return this.getAdjacentMask(direction & 0xAA);
    }
  }

  getAdjacentMask(direction) {
    switch (direction) {
      case 0x08:  //0b00001000
        return 0;  //0..3
      case 0x02:  //0b00000010
        return 4;  //4..7
      case 0x20:  //0b00100000
        return 8;  //8..11
      case 0x80:  //0b10000000
        return 12; //12..15
      case 0x22:  //0b00100010
        return 20;
      case 0x88:  //0b10001000
        return 21;
      case 0xA0:  //0b10100000
        return 22;
      case 0x82:  //0b10000010
        return 23;
      case 0x28:  //0b00101000
        return 24;
      case 0x0A:  //0b00001010
        return 25;
      case 0x2A:  //0b00101010
        return 26;
      case 0xA8:  //0b10101000
        return 27;
      case 0xA2:  //0b10100010
        return 28;
      case 0x8A:  //0b10001010
        return 29;
      case 0xAA:  //0b10101010
        return 30;
      default:
        console.log("No mask", direction.toString(16));
        return -1;
    }
  }

  getBlendingMode(base_id, terrain_id) {
    // var base_mode = blend_mask_lookup[base_id];
    // var neighbor_mode = blend_mask_lookup[terrain_id];
    //
    // return neighbor_mode > base_mode ? neighbor_mode : base_mode;
    var blend_mode_id = this.blend_mask_lookup[base_id][terrain_id];
    return this.modes[blend_mode_id];
  }

  getMasks(i, j, tile, influences) {
    var masks = [];
    for (const [terrain_id,direction] of Object.entries(influences)) {
      if (direction == 0) {
        continue;
      }

      var mask_id = this.getInflueceMask(direction);

      if (mask_id <= 12) {
        mask_id += (i+j) & 0x03;
      }
      var mode = this.getBlendingMode(tile.terrain.terrain_id,terrain_id);
      if (mask_id >= 0) {
        masks.push({
          bit: mode.bitmasks[mask_id],
          alpha: mode.alphamasks[mask_id],
          terrain: terrain_id
        });
      }
    }
    return masks;
  }

  draw(camera) {
    var tcxt = resources.getTerrain2DContext();
    // var blend = false;
    var blend = true;
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
          if (blend) {
            var neighbors = this.getNeighbors(i,j);
            var influences = this.getInfluences(f, neighbors);
            var masks = this.getMasks(i, j, f, influences);
            if (i == 11 && j == 11) {
              console.log(influences);
            //   debugger;
            }

            if (masks.length) {
              // console.log(i, j);
              // console.log(masks);
              for (var mask of masks) {

                var m = this.getTerrainById(mask.terrain);
                var frame_id = (j % m.tc) + ((i % m.tc) * m.tc);
                // m.frames[frame_id].drawTerrain(this.pos.add(cell).subtract(camera));

                var img = this.applyMask(mask, m.frames[frame_id].img);
                resources.drawImage(img, this.pos.add(cell).subtract(camera), tcxt);
              }
            }
          }
        }
      }
    }
  }

  applyMask(mask, img) {
    var img1 = resources.createImage(img.width, img.height);
    for (var i = 0; i < img.height; i++) {
      for (var j = 0; j < img.width; j++) {
        var k = i * img.width + j;
        img1.data[ 4 * k + 0] = img.data[ 4 * k + 0];
        img1.data[ 4 * k + 1] = img.data[ 4 * k + 1];
        img1.data[ 4 * k + 2] = img.data[ 4 * k + 2];
        if (mask.alpha.data[4 * k + 3] == 0) {
          img1.data[ 4 * k + 3] = 0;
        }
        else if (mask.alpha.data[4 * k + 3] == 255) {
          img1.data[ 4 * k + 3] = 0;
        }
        else {
          img1.data[ 4 * k + 3] = mask.alpha.data[4 * k + 1];
        }
      }
    }
    return img1;
  }

  getTerrainById(terrain_id) {
    for (const [name,terrain] of Object.entries(this.models)) {
      if (terrain.terrain_id == terrain_id) {
        return terrain;
      }
    }
    return null;
  }

  setTile(i,j,type) {
    if (this.create_tiles) {
      this.create_tiles[i][j] = type;
    }
    else {
      var m = this.models[type];
      var frame_id = (j % m.tc) + ((i % m.tc) * m.tc);
      // TODO aca necesito info del terreno
      m.frames[frame_id].terrain = m;
      this.tiles[i][j] = m.frames[frame_id];
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
        var name = this.create_tiles[i][j];
        var m = this.models[name];
        var frame_id = (j % m.tc) + ((i % m.tc) * m.tc);
        // TODO aca necesito info del terreno
        m.frames[frame_id].terrain = m;
        this.tiles[i].push(m.frames[frame_id]);
      }
    }

    this.modes = await Blendomatic.getBlendingModes();

    this.create_tiles = null;
  }
};
