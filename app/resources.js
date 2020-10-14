const DrsFile = require("./js/drs/drs");
const SlpModel = require("./js/slp/model");
const SlpUnitModel = require("./js/slp/unit");
const SlpTerrainModel = require("./js/slp/terrain");
const SlpProjectileModel = require("./js/slp/projectile");
const SlpPalette = require("./js/slp/palette");
const SimplePainter = require('./painters/simple');
const SmartPainter = require('./painters/smart');

module.exports = class ResourceManager {

  constructor(){
    this.models = {};
    this.palettes = {};
    this.colors = {};
    this.icons = {};
    this.sounds = {};
    this.dir = ".";
    // this.painter = new SimplePainter();
    this.painter = new SmartPainter();
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
    var c = document.getElementById("auxCanvas");
    this.auxcontext2d = c.getContext("2d");
    return this.auxcontext2d;
  }

  get2DContext() {
    if (this.context2d) {
      return this.context2d;
    }
    var c = document.getElementById("entitiesCanvas");
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

  getFog2DContext() {
    if (this.fogContext2d) {
      return this.fogContext2d;
    }
    var c = document.getElementById("fogCanvas");
    this.fogContext2d = c.getContext("2d");
    return this.fogContext2d;
  }

  putImage(img, v, ctx) {
    this.painter.putImage(img, v, ctx);
  }

  isOut(canvas, img, x, y) {
    this.painter.isOut(canvas, img, x, y);
  }

  clear(ctx) {
    this.painter.clear(ctx);
  }

  clearTerrain(ctx) {
    this.painter.clearTerrain();
  }

  drawRefresh() {
    this.painter.refhresh();
  }

  clearFog(ctx) {
    if(!ctx) {
      ctx = this.getFog2DContext();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
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
  }

  drawCompleted() {
    this.painter.drawCompleted();
  }

  drawImage(img, v, ctx) {
    this.painter.drawImage(img, v, ctx);
  }

  drawCircle(v, rad, ctx) {
    this.painter.drawCircle(v, rad, ctx);
  }

  drawHitpoints(v, val, player, ctx) {
    this.painter.drawHitpoints(v, val, player, ctx);
  }

  drawSquare(v, size, ctx) {
    this.painter.drawSquare(v, size, ctx);
  }

  drawLineOfSeight(v, ctx = null) {
    if(!ctx) {
      ctx = this.getFog2DContext();
    }
    var x = v.e(1), y = v.e(2);
    let size = 100;

    ctx.beginPath();
    ctx.moveTo(x, y - size / 4);
    ctx.lineTo(x - size / 2, y);
    ctx.lineTo(x, y + size / 4);
    ctx.lineTo(x + size / 2, y);
    ctx.closePath();
    ctx.fill();
  }

  drawOldLineOfSeight(v, ctx = null) {
    if(!ctx) {
      ctx = this.getFog2DContext();
    }
    var x = v.e(1), y = v.e(2);
    let size = 100;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.moveTo(x, y - size / 4);
    ctx.lineTo(x - size / 2, y);
    ctx.lineTo(x, y + size / 4);
    ctx.lineTo(x + size / 2, y);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
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
