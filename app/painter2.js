const Painter = require('./painter');

module.exports = class Painter2 {

  constructor() {
    this.commands = [];
    this.old_commands = [];
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
    // for (var c of this.commands) {
    //   ctx.clearRect(c.pos.e(1), c.pos.e(2), c.width, c.height);
    // }
    // this.old_commands = this.commands;
    // this.commands = [];
  }

  clearTerrain(ctx) {
    this.painter.clearTerrain();
  }

  refhresh() {
    for (var c of this.old_commands) {
      this.commandsRun(c);
    }
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
    if (ctx === resources.getTerrain2DContext()) {
      this.painter.drawImage(img, v, ctx);
      return;
    }
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
      height: size/2+2,
      pos: v.subtract($V([size/2+1,size/4+1])),
      center: v,
      ctx: ctx,
    });
  }

  drawSelect(start, diff, ctx) {
    var x = diff.e(1) > 0 ? start.e(1) : start.e(1) + diff.e(1);
    var y = diff.e(2) > 0 ? start.e(2) : start.e(2) + diff.e(2);
    this.commands.push({
      type: 'select',
      diff: diff,
      pos: $V([x-1,y-1]),
      start: start,
      width: Math.abs(diff.e(1)) + 2,
      height: Math.abs(diff.e(2)) + 2,
      ctx: ctx,
    });
  }

  drawCompleted() {

    var removed = this.commandsDiff(this.old_commands, this.commands);
    var added =  this.commandsDiff(this.commands, this.old_commands);

    var toRedraw = [];

    for (var c of this.commands) {
      var c1;
      redrawAdded:
      for (c1 of added) {
        if (this.commandCompare(c, c1) || this.commandsOverlap(c, c1)) {
          toRedraw.push(c);
          continue redrawAdded;
        }
      }
      redrawRemoved:
      for (c1 of removed) {
        if (this.commandsOverlap(c, c1)) {
          toRedraw.push(c);
          continue redrawRemoved;
        }
      }
    }


    var ctx1 = resources.get2DContext();
    for (c of removed) {
      var ctx = c.ctx || ctx1;
      if (ctx) {
        ctx.clearRect(c.pos.e(1), c.pos.e(2), c.width, c.height);
      }
    }

    for (c of toRedraw) {
      this.commandsRun(c);
    }
    this.old_commands = this.commands;
    this.commands = [];
  }


  commandsRun(c) {
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
        this.painter.drawSelect(c.start, c.diff, c.ctx);
        break;
    }
  }

  commandsDiff(a1, a2) {
    return a1.filter(x => !a2.some((e) => this.commandCompare(x,e) ));
  }

  commandCompare(c1, c2) {
    if (c1.type != c2.type || !c1.pos.eql(c2.pos) || c1.width != c2.width || c1.height != c2.height) {
      return false;
    }
    switch (c1.type) {
      case 'put':
        return c1.image === c2.image;
      case 'draw':
        return c1.image === c2.image;
      case 'circle':
        return c1.rad == c2.rad;
      case 'hits':
        return c1.val == c2.val && c1.player == c2.player;
      case 'square':
        return c1.size == c2.size;
      case 'select':
        return c1.diff.eql(c2.diff);
    }
    return false;
  }

  commandsOverlap(c1,c2) {
    var c1x1 = c1.pos.e(1), c1y1 = c1.pos.e(2);
    var c2x1 = c2.pos.e(1), c2y1 = c2.pos.e(2);
    var c1x2 = c1x1 + c1.width, c1y2 = c1y1 + c1.height;
    var c2x2 = c2x1 + c2.width, c2y2 = c2y1 + c2.height;

    return c1x1 <= c2x2 && c1x2 >= c2x1 && c1y1 <= c2y2 && c1y2 >= c2y1;
  }

};
