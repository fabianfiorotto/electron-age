module.exports = class Painter {

  putImage(img, v, ctx) {
    if(!ctx) {
      ctx = resources.get2DContext();
    }
    ctx.putImageData(img, v.e(1), v.e(2));
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
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  clearTerrain(ctx) {
    if(!ctx) {
      ctx = resources.getTerrain2DContext();
    }
    // tr_ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000";
    ctx.fill();
  }

  drawImage(img, v, ctx) {
    var aux = resources.getAux2DContext();
    if(!ctx) {
      ctx = resources.get2DContext();
    }
    var x = v.e(1);
    var y = v.e(2);

    if (this.isOut(ctx.canvas, img, x, y)) {
      return;
    }

    aux.canvas.setAttribute('width', img.width);
    aux.canvas.setAttribute('height', img.height);
    aux.clearRect(0, 0, aux.canvas.width, aux.canvas.height);
    aux.putImageData(img, 0, 0);

    ctx.drawImage(aux.canvas, x, y);
  }

  drawCircle(v, rad, ctx) {
    if(!ctx) {
      ctx = resources.get2DContext();
    }
    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    ctx.ellipse(v.e(1), v.e(2), rad, rad  / 2, - Math.atan(0.5), 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawHitpoints(v, val, player, ctx) {
    if(!ctx) {
      ctx = resources.get2DContext();
    }
    var base_id = 50505;
    if (!resources.palettes[base_id]) {
      return;
    }
    var x = v.e(1), y = v.e(2);

    var color = resources.palettes[base_id][16 * player + 0];
    ctx.fillStyle = "rgb(" + color.join(',') +")";
    ctx.beginPath();
    ctx.rect(x, y, 40, 5);
    ctx.fill();

    color = resources.palettes[base_id][16 * player + 5];
    ctx.fillStyle = "rgb(" + color.join(',') +")";
    ctx.beginPath();
    ctx.rect(x, y, Math.round(40 * val), 5);
    ctx.fill();
  }

  drawSquare(v, size, ctx) {
    if(!ctx) {
      ctx = resources.get2DContext();
    }
    var x = v.e(1), y = v.e(2);

    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    ctx.moveTo(x, y - size / 4);
    ctx.lineTo(x - size / 2, y);
    ctx.lineTo(x, y + size / 4);
    ctx.lineTo(x + size / 2, y);
    ctx.closePath();
    ctx.stroke();
  }

  drawSelect(start, diff, ctx) {
    if(!ctx) {
      ctx = resources.get2DContext();
    }
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.rect(start.e(1), start.e(2) , diff.e(1), diff.e(2));
    ctx.stroke();
  }

  drawCompleted() {
  }

};
