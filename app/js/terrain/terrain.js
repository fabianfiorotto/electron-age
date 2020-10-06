const Blendomatic = require("../blendomatic/blendomatic");

const types = require("./types");

module.exports = class Terrain {

  /* jshint ignore:start */
  static TILE_WIDTH = 96;
  static TILE_HEIGHT = 48;
  static TILE_HALF_WIDTH = 48;
  static TILE_HALF_HEIGHT = 24;
  /* jshint ignore:end */

  constructor(width, height) {
    this.type = types;
    this.tiles = [];
    this.tiles = Array.from({length: width}, ()=> {
      return Array.from({length: height}, () => {
        return { terrain: this.type.grass, elevation: 1};
      });
    });
    this.models = {};

    this.width = width;
    this.height = height;
    // this.pos = $V([-650, 250]); //TODO remove
    this.pos = $V([0, 0]);

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

    this.redraw = true;
    this.neighbor_lookup = [4, 3, 2, 5, 0, 7, 6, 1];


    //Transform matrix
    this.m = $M([
      [ Terrain.TILE_HALF_WIDTH,   Terrain.TILE_HALF_WIDTH],
      [ Terrain.TILE_HALF_HEIGHT, -Terrain.TILE_HALF_HEIGHT]
      // [24, -24] invert Y axis
    ]);

    this.mr = $M([
      [ 1/Terrain.TILE_WIDTH,  1/Terrain.TILE_HEIGHT],
      [ 1/Terrain.TILE_WIDTH, -1/Terrain.TILE_HEIGHT]
    ]);

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
        if (!influences[neighbor.terrain.id]) {
          influences[neighbor.terrain.id] = {
            direction: 0,
            terrain: neighbor.terrain
          };
        }
        if (k % 2 == 0) {
          var mask = (1 << ((k - 1) & 0x07)) | (1 << ((k + 1) & 0x07));

          if (influences[neighbor.terrain.id] & mask) {
            continue;
          }
        }
        influences[neighbor.terrain.id].direction |= 1 << k;
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
    var blend_mode_id = this.blend_mask_lookup[base_id][terrain_id];
    return this.modes[blend_mode_id];
  }

  getMasks(i, j, tile, influences) {
    var masks = [];
    for (const [tid,influence] of Object.entries(influences)) {
      if (influence.direction == 0) {
        continue;
      }

      var mask_id = this.getInflueceMask(influence.direction);

      if (mask_id <= 12) {
        mask_id += (i+j) & 0x03;
      }
      var mode = this.getBlendingMode(tile.terrain.terrain_id, influence.terrain.terrain_id);
      if (mask_id >= 0) {
        masks.push({
          bit: mode.bitmasks[mask_id],
          alpha: mode.alphamasks[mask_id],
          terrain: influence.terrain
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
          var tile = this.tiles[i][j];
          if (!tile.frame) {
            continue;
          }
          var f = tile.frame;
          var w = f.width - 1, h = f.height - 1;
          var cell = $V([
            (i + j) * w / 2,
            (i - j) * h / 2
          ]);
          f.drawTerrain(this.pos.add(cell).subtract(camera));
          if (blend) {
            var neighbors = this.getNeighbors(i,j);
            var influences = this.getInfluences(tile, neighbors);
            var masks = this.getMasks(i, j, tile, influences);

            if (masks.length) {
              // console.log(i, j);
              // console.log(masks);
              for (var mask of masks) {

                var m = mask.terrain.model;
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
    this.redraw = false;
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
    this.tiles[i][j].terrain = this.type[type];
    if (this.models[type]) {
      var m = this.models[type];
      var frame_id = (j % m.tc) + ((i % m.tc) * m.tc);

      m.frames[frame_id].terrain = m;
      this.tiles[i][j].frame = m.frames[frame_id];
      this.redraw = true;
    }
  }

  getTileAt(pos) {
    pos = this.mr.x(pos);
    pos = pos.map((e) => Math.floor(e));
    var i = pos.e(1), j = pos.e(2);
    if (!this.tiles[i] || !this.tiles[i][j] ) {
      return null;
    }
    return this.tiles[i][j];
  }

  isWater(pos) {
    let tile = this.getTileAt(pos);
    if (!tile) {
      return false;
    }
    return tile.terrain.water || false;
  }

  isLand(pos) {
    let tile = this.getTileAt(pos);
    if (!tile) {
      return false;
    }
    return !tile.terrain.water;
  }

  isWaterAtVec(pos1,pos2) {
    var v = pos2.subtract(pos1).toUnitVector();
    var d = pos1.distanceFrom(pos2);

    var times = Math.floor(d / Terrain.TILE_HEIGHT) + 1;

    for (var i = 0; i < times; i++) {
      var v1 = v.x(Terrain.TILE_HEIGHT).x(i+1);
      if (this.isWater(pos1.add(v1))) {
        return true;
      }
    }

    return false;
  }

  isLandAtVec(pos1,pos2) {
    var v = pos2.subtract(pos1).toUnitVector();
    var d = pos1.distanceFrom(pos2);

    var times = Math.floor(d / Terrain.TILE_HEIGHT) + 1;

    for (var i = 0; i < times; i++) {
      var v1 = v.x(Terrain.TILE_HEIGHT).x(i+1);
      if (this.isLand(pos1.add(v1))) {
        return true;
      }
    }

    return false;
  }

  async loadResources(res) {
    for (const [key,type] of Object.entries(this.type)){
      this.models[key] = await res.loadTerrain(type.slp);
      this.models[key].load({
        base: res.palettes[50505],
        player: 0
      });
      type.model = this.models[key];
    }

    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        var m = this.tiles[i][j].terrain.model;
        var frame_id = (j % m.tc) + ((i % m.tc) * m.tc);

        m.frames[frame_id].terrain = m;
        this.tiles[i][j].frame = m.frames[frame_id];
      }
    }

    this.modes = await Blendomatic.getBlendingModes();
    this.redraw = true;
  }
};
