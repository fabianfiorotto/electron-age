module.exports = class SlpFrame {

  constructor() {
    this.rows = [];
    this.imgs = {};
  }

  load(colors) {
    var pid = colors.player;
    if (!this.imgs[pid]) {

      if (this.flipped) {
        if (!this.original.imgs[pid]) {
          this.original.load(colors);
        }
        this.img = resources.flipImage(this.original.imgs[pid]);
      }
      else {
        this.img = resources.createImage(this.width, this.height);
        this.rows.forEach((row,i) => {
          row.load(this.img, i, colors);
        });
      }
      this.imgs[pid] = this.img;
    }
  }

  put(pos, player) {
    if (player) {
      resources.putImage(this.imgs[player], pos.subtract(this.hotspot));
    }
    else {
      resources.putImage(this.img, pos.subtract(this.hotspot));
    }
  }

  draw(pos, player) {
    if (player && this.imgs[player]) {
      resources.drawImage(this.imgs[player], pos.subtract(this.hotspot));
    }
    else {
      resources.drawImage(this.img, pos.subtract(this.hotspot));
    }
  }

  drawTerrain(pos) {
    var ctx = resources.getTerrain2DContext();
    resources.drawImage(this.img, pos.subtract(this.hotspot), ctx);
  }

  canClick(pos) {
    var p = this.hotspot.subtract(pos);
    var x = p.e(1), y = p.e(2);
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      return false;
    }
    var i = this.img.width * y + x;
    return this.img.data[i * 4 + 3] != 0;
  }

  getUrl() {
    return resources.getUrl(this.img);
  }

  flip() {
    var inv = new SlpFrame();
    var h = this.hotspot;
    inv.hotspot = $V([this.width - h.e(1), h.e(2)]);
    inv.width = this.width;
    inv.height = this.height;
    // inv.rows = this.rows.map((r) => r.flip());
    inv.flipped = true;
    inv.original = this;
    return inv;
  }

};
