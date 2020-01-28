var DrsFile = require("./js/drs/drs");
var SlpModel = require("./js/slp/model");
var SlpUnitModel = require("./js/slp/unit");
var SlpTerrainModel = require("./js/slp/terrain");
var SlpProjectileModel = require("./js/slp/projectile");
var SlpPalette = require("./js/slp/palette");

module.exports = class ResourceManager {

  constructor(){
    this.models = {};
    this.palettes = {};
    this.colors = {};
    this.icons = {};
    this.sounds = {};
    this.dir = ".";
  }

  async loadPalette(pid) {
    if (this.palettes[pid]) {
      return this.palettes[pid];
    }
    var filename = this.dir + "/DATA/interfac.drs";
    var drs = new DrsFile();
    await drs.open(filename, pid, "pls");
    this.palettes[pid] = await SlpPalette.load(drs);
    this.palettes[pid].id = pid;
    // drs.close();
    return this.palettes[pid];
  }

  getAux2DContext() {
    if (this.auxcontext2d) {
      return this.auxcontext2d;
    }
    var c = document.getElementById("myCanvas2");
    this.auxcontext2d = c.getContext("2d");
    return this.auxcontext2d;
  }

  get2DContext() {
    if (this.context2d) {
      return this.context2d;
    }
    var c = document.getElementById("myCanvas");
    this.context2d = c.getContext("2d");
    return this.context2d;
  }

  getTerrain2DContext() {
    if (this.terrainContext2d) {
      return this.terrainContext2d;
    }
    var c = document.getElementById("terrainCanvas");
    this.terrainContext2d = c.getContext("2d");
    return this.terrainContext2d;
  }

  putImage(img, v, ctx) {
    if(!ctx) {
      ctx = this.get2DContext();
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

  drawImage(img, v, ctx) {
    var aux = this.getAux2DContext();
    if(!ctx) {
      ctx = this.get2DContext();
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
      ctx = this.get2DContext();
    }
    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    ctx.ellipse(v.e(1), v.e(2), rad, rad  / 2, - Math.atan(0.5), 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawHitpoints(v, val, player, ctx) {
    if(!ctx) {
      ctx = this.get2DContext();
    }
    var base_id = 50505;
    if (!this.palettes[base_id]) {
      return;
    }
    var x = v.e(1), y = v.e(2);

    var color = this.palettes[base_id][16 * player + 0];
    ctx.fillStyle = "rgb(" + color.join(',') +")";
    ctx.beginPath();
    ctx.rect(x, y, 40, 5);
    ctx.fill();

    color = this.palettes[base_id][16 * player + 5];
    ctx.fillStyle = "rgb(" + color.join(',') +")";
    ctx.beginPath();
    ctx.rect(x, y, Math.round(40 * val), 5);
    ctx.fill();
  }

  drawSquare(v, size, ctx) {
    if(!ctx) {
      ctx = this.get2DContext();
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
      ctx = this.get2DContext();
    }
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.rect(start.e(1), start.e(2) , diff.e(1), diff.e(2));
    ctx.stroke();
  }

  playSound(audioBuffer) {
    var audioCtx = new AudioContext();
    var source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);
  }

  createImage(width, height) {
    var ctx = this.get2DContext();
    return ctx.createImageData(width, height);
  }

  getUrl(img) {
    var aux = this.getAux2DContext();
    aux.canvas.setAttribute('width', img.width);
    aux.canvas.setAttribute('height', img.height);
    aux.clearRect(0, 0, aux.canvas.width, aux.canvas.height);
    aux.putImageData(img, 0, 0);
    return aux.canvas.toDataURL();
  }

  cropUrl(img, sx, sy, width, height) {
    var aux = this.getAux2DContext();

    aux.canvas.setAttribute('width', img.width);
    aux.canvas.setAttribute('height', img.height);
    aux.clearRect(0, 0, aux.canvas.width, aux.canvas.height);
    aux.putImageData(img, 0, 0);
    img = aux.getImageData(sx, sy, width, height);

    aux.canvas.setAttribute('width', width);
    aux.canvas.setAttribute('height', height);
    aux.clearRect(0, 0, width, height);
    aux.putImageData(img, 0, 0);

    return aux.canvas.toDataURL();
  }

  flipImage(img) {
    var inv = this.createImage(img.width, img.height);
    for (var i = 0; i < img.height; i++) {
      for (var j = 0; j < img.width; j++) {
        var org = i * img.width + j;
        var des = i * img.width + img.width - (j % img.width + 1);
        inv.data[4 * des + 0] = img.data[4 * org + 0];
        inv.data[4 * des + 1] = img.data[4 * org + 1];
        inv.data[4 * des + 2] = img.data[4 * org + 2];
        inv.data[4 * des + 3] = img.data[4 * org + 3];
      }
    }
    return inv;
  }

  async loadModel(id, file, modelClass) {
    if (this.models[id]) {
      return this.models[id];
    }
    var filename, model;
    if (file) {
      filename = this.dir + "/DATA/" + file + ".drs";
    }
    else {
      filename = this.dir + "/DATA/graphics.drs";
    }

    var drs = new DrsFile();
    await drs.open(filename, id, "pls");
    if (modelClass) {
      model = new modelClass();
    }
    else {
      model = new SlpModel();
    }
    await model.loadFrames(drs);

    // drs.close();
    this.models[id] = model;
    return model;
  }

  async loadTerrain(id) {
    return await this.loadModel(id, 'terrain',  SlpTerrainModel);
  }

  async loadInterface(id) {
    return await this.loadModel(id, 'interfac');
  }

  async loadUnit(id) {
    return await this.loadModel(id, 'graphics', SlpUnitModel);
  }

  async loadProjectile(id) {
    return await this.loadModel(id, 'graphics', SlpProjectileModel);
  }

  async loadSound(id, fname) {
    if (this.sounds[id]) {
      return this.sounds[id];
    }
    var filename;
    if (fname) {
      filename = this.dir + "/DATA/" + fname + ".drs";
    }
    else {
      filename = this.dir + "/DATA/sounds.drs";
    }

    var drs = new DrsFile();
    var file = await drs.open(filename, id, "vaw");

    var stat = await file.stat();
    var buffer = Buffer.alloc(stat.size);
    await file.read(buffer, 0, buffer.length, 0);
    file.close();

    var audioCtx = new AudioContext();

    var arrayBuffer = new ArrayBuffer(buffer.length);
    var bufferView = new Uint8Array(arrayBuffer);
    for (var i = 0; i < buffer.length; i++) {
      bufferView[i] = buffer.readUInt8(i);
    }

    this.sounds[id] = await audioCtx.decodeAudioData(arrayBuffer);

    return this.sounds[id];
  }

  async loadInterfaceSound(id) {
    return await this.loadSound(id, 'interfac');
  }

  // -------------------------------------------------

  async load(entity) {
    await entity.loadResources(this);
    var res = entity.getModelsResources();
    var base_id = 50505;

    if (res.unit) {
      for (const [key,value] of Object.entries(res.unit)){
        entity.models[key] = await this.loadUnit(value);
        entity.models[key].load({
          base: this.palettes[base_id],
          player: res.player_id
        });
      }
    }
    if (res.model) {
      for (const [key,value] of Object.entries(res.model)){
        entity.models[key] = await this.loadModel(value);
        entity.models[key].load({
          base: this.palettes[base_id],
          player: res.player_id
        });
      }
    }
    if (res.sounds) {
      for (const [key,value] of Object.entries(res.sounds)){
        entity.sounds[key] = await this.loadSound(value);
      }
    }
    if (res.interfaceSounds) {
      for (const [key,value] of Object.entries(res.interfaceSounds)){
        entity.sounds[key] = await this.loadSound(value, 'interfac');
      }
    }
    var iconsRes = entity.iconsResources();
    for (const icons of iconsRes){
      var model = await this.loadInterface(icons.interface);
      model.load({
        base: this.palettes[base_id],
        player: res.player_id
      });
      for (const [key,value] of Object.entries(icons.frames)){
        if (key == 'thumbnail') {
          var img = model.frames[value].imgs[res.player_id];
          entity.icons.thumbnail = this.getUrl(img);
        }
        else {
          entity.icons[key] = model.frames[value].getUrl();
        }
      }
    }
    entity.onResourcesLoaded();
  }
};
