module.exports = class BlendingMode {

  getTileFromData(data) {
      var halfRowCount = Math.floor(this.rowCount / 2);
      var img = resources.createImage(this.rowCount * 2 - 1, this.rowCount);

      var read_so_far = 0;
      var tilerows = [];

      for (var i = 0; i < this.rowCount; i++) {
        var read_values;
        if (i < halfRowCount) {
          read_values = 1 + (4 * i);
        }
        else {
          read_values = (((this.rowCount * 2) - 1) - (4 * (i - halfRowCount)));
        }
        var pixels = data.slice(read_so_far, read_so_far + read_values);

        var space_count = this.rowCount - 1 - Math.floor(read_values / 2);

        if (pixels.length) {
          var padding = Buffer.alloc(space_count, 255); //(-1)
          pixels = Buffer.concat([padding, pixels, padding]);
        }
        else {
          pixels = Buffer.alloc(2 * space_count, 255);
        }

        read_so_far += read_values;

        for (var j = 0; j < pixels.length; j++) {
          let alpha_data = pixels[j];
          var alpha, val;
          if (alpha_data == 255) {
            alpha = 0;
            val = 0;
          }
          else if (alpha_data == 128) {
            alpha = 255;
            val = 0;
          }
          else {
            alpha = 128;
            val = (127 - (alpha_data & 0x7f)) * 2;
          }
          var k = i * img.width + j;
          img.data[ 4 * k + 0] = val;
          img.data[ 4 * k + 1] = val;
          img.data[ 4 * k + 2] = val;
          img.data[ 4 * k + 3] = alpha;
        }
      }

      return img;
  }


  getPictureData(tile) {
    // Lo que hace aca es convertir i bit en 4 de rgba
    var tile_rows = [];

    for (var picture_row of tile.rows) {
      var tile_row_data = [];
      for (var alpha_data of picture_row) {
        var alpha, val;
        if (alpha_data == 255) {
          alpha = 0;
          val = 0;
        }
        else {
          alpha = 128;
          val = (127 - (alpha_data & 0x7f)) * 2;
        }
        tile_row_data.push((val, val, val, alpha));
      }
      tile_rows.push(tile_row_data);
    }
    return tile_rows;
  }

};
