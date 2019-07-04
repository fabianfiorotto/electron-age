module.exports = class SlpRow {
  constructor() {
    this.commands = [];
  }

  load(imgData, y, colors) {
    colors.transparent = [0, 0, 0, 0];
    colors.shadow = [64, 64, 64, 64];
    colors.special1 = [255, 0, 0];
    colors.special2 = [0, 0, 255];
    colors.player |= 0;
    var pos = {x: 0, y: y};
    var i;
    if (this.left == 0x8000 || this.right == 0x8000) {
      for (i = 0; i < imgData.width; i++) {
        this.color(imgData, pos, colors.transparent);
      }
      return;
    }
    for (i = 0; i < this.left; i++) {
      this.color(imgData, pos, colors.transparent);
    }
    this.commands.forEach((cmd, i) => {
      this.cmd(imgData, cmd, pos, colors);
    });
    for (i = 0; i < this.right; i++) {
      this.color(imgData, pos, colors.transparent);
    }
  }

  cmd(imgData, cmd, pos, colors) {
    var i, c;
    switch (cmd.code) {
      case 0x00: case 0x02: case 0x04: case 0x08: case 0x0c:
        for (i = 0; i < cmd.count; i++) {
          c = cmd.data[i];
          this.color(imgData, pos, colors.base[c]);
        }
        break;
      case 0x01: case 0x03: case 0x05: case 0x09: case 0x0d:
        for (i = 0; i < cmd.count; i++) {
          this.color(imgData, pos, colors.transparent);
        }
        break;
      case  0x06:
        for (i = 0; i < cmd.count; i++) {
          c = cmd.data[i];
          this.color(imgData, pos,colors.base[c + colors.player * 16]);
        }
        break;
      case  0x07:
        for (i = 0; i < cmd.count; i++) {
          this.color(imgData, pos,colors.base[cmd.data]);
        }
        break;
      case  0x0A:
        for (i = 0; i < cmd.count; i++) {
          this.color(imgData, pos,colors.base[cmd.data + colors.player * 16]);
        }
        break;
      case  0x0B:
        for (i = 0; i < cmd.count; i++) {
          this.color(imgData, pos, colors.shadow);
        }
        break;
      case 0x5e: case 0x4e:
        for (i = 0; i < cmd.count; i++) {
          this.color(imgData, pos, colors.special1);
        }
        break;
      case 0x6e: case 0x7e:
        for (i = 0; i < cmd.count; i++) {
          this.color(imgData, pos, colors.special2);
        }
        break;
      default:
        // console.log("Unknown comand code " + cmd.code.toString(16));
    }
  }

  color(imgData,pos, color) {
    var p = pos.y * imgData.width + pos.x;
    p *= 4;
    imgData.data[p + 0] = color[0];
    imgData.data[p + 1] = color[1];
    imgData.data[p + 2] = color[2];
    imgData.data[p + 3] = color.length > 3 ? color[3] : 255;
    pos.x++;
  }

  flip() {
    var inv = new SlpRow();
    inv.left = this.right;
    inv.right = this.left;
    inv.commands = this.commands.slice().reverse().map((c) => this.flipCmd(c));
    // Invertir el data del comando
    return inv;
  }

  flipCmd(cmd) {
    if (cmd.data instanceof Buffer || Array.isArray(cmd.data)) {
      var inv = {};
      for (const [key,value] of Object.entries(cmd)){
        if (key == 'data') {
          inv.data = value.slice().reverse();
        }
        else {
          inv[key] = value;
        }
      }
      return inv;
    }
    else {
      return cmd;
    }
  }

};
