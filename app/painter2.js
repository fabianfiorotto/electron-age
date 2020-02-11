const Painter = require('./painter');

module.exports = class Painter2 {

  constructor() {
    this.commands = [];
    this.painter = new Painter();
  }

  isOut(canvas, img, x, y) {
    if (x > canvas.width || img.width + x < 0) {
      return true;
    }
    if (y > canvas.height || img.height + y < 0) {
      return true;
    }
    return false;
  }

  clear(ctx) {
    if(!ctx) {
      ctx = resources.get2DContext();
    }
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var c of this.commands) {
      ctx.clearRect(c.pos.e(1), c.pos.e(2), c.width, c.height);
    }
    this.commands = [];
  }

  clearTerrain(ctx) {
    this.painter.clearTerrain();
  }

  putImage(img, v, ctx) {
    this.commands.push({
      type: 'put',
      img: img,
      width: img.width,
      height: img.height,
      pos: v
    });
  }

  drawImage(img, v, ctx) {
    this.commands.push({
      type: 'draw',
      img: img,
      width: img.width,
      height: img.height,
      pos: v,
      ctx: ctx,
    });
  }

  drawCircle(v, rad, ctx) {
    this.commands.push({
      type: 'circle',
      rad: rad,
      width: 2*rad,
      height: 2*rad,
      pos: v.subtract($V([rad, rad])),
      center: v,
      ctx: ctx,
    });
  }

  drawHitpoints(v, val, player, ctx) {
    this.commands.push({
      type: 'hits',
      val: val,
      pos: v.subtract($V([1,1])),
      center: v,
      width: 50,
      height: 10,
      player: player,
      ctx: ctx,
    });
  }

  drawSquare(v, size, ctx) {
    this.commands.push({
      type: 'square',
      size: size,
      width: size+2,
      height: size+2,
      pos: v.subtract($V([size/2+1,size/4+1])),
      center: v,
      ctx: ctx,
    });
  }

  drawSelect(start, diff, ctx) {
    var size = diff.subtract(start);
    this.commands.push({
      type: 'select',
      pos: start,
      diff: diff,
      width: size.e(1),
      height: size.e(2),
      ctx: ctx,
    });
  }

  drawCompleted() {
    for (var c of this.commands) {
      switch (c.type) {
        case 'put':
          this.painter.putImage(c.img, c.pos, c.ctx);
          break;
        case 'draw':
          this.painter.drawImage(c.img, c.pos, c.ctx);
          break;
        case 'circle':
          this.painter.drawCircle(c.center,c.rad, c.ctx);
          break;
        case 'hits':
          this.painter.drawHitpoints(c.center, c.val, c.player, c.ctx);
          break;
        case 'square':
          this.painter.drawSquare(c.center, c.size, c.ctx);
          break;
        case 'select':
          this.painter.drawSelect(c.pos, c.diff, c.ctx);
          break;
      }
    }
  }

};
