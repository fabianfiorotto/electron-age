var DrsFile = require("../js/drs/drs");
var SlpModel = require("../js/slp/model");
var SlpUnitModel = require("../js/slp/unit");
var SlpPalette = require("../js/slp/palette");
var ResourceManager = require("../resources");

var Blendomatic = require('../js/blendomatic/blendomatic');

require("sylvester");

var model = null;
var terrain = null;
var frame = 0;
var orientation = 0;
var pos = $V([550, 100]);

window.resources = new ResourceManager();

var loadModel = async function(id) {
  var palette = await resources.loadPalette(50505);
  if (id == 2 || id == 8) {
    slp = await resources.loadUnit(id);
  }
  else {
    slp = await resources.loadModel(id);
  }
  slp.load({base: palette, player: 0});
  frame = 0;
  model = slp;
};

var loadTerrain = async function(id) {
  var palette = await resources.loadPalette(50505);
  terrain = await resources.loadTerrain(id);
  terrain.load({base: palette, player: 0});
};

var loadInterface = async function(id) {
  var palette = await resources.loadPalette(50505);
  model = await resources.loadInterface(id);

  model.load({base: palette, player: 0});
  var img = document.getElementById('slp-image');
  img.setAttribute('src', model.frames[0].getUrl());
};

// ----- Model select
drs = new DrsFile();
filename = resources.dir + "/DATA/graphics.drs";
drs.ls(filename).then((ids) => {
  var select = document.getElementById("slp");

  for (var i = 0; i < ids.length; i++) {
    var option = document.createElement("option");
    option.text = ids[i];
    option.value = ids[i];
    select.appendChild(option);
  }

  select.addEventListener('change', ()=> loadModel(select.value));

});

var playSound = async function(id, filename) {
  filename = resources.dir + "/DATA/" + filename;
  drs = new DrsFile();
  var file = await drs.open(filename, id, "vaw");

  var stat = await file.stat();
  var buffer = Buffer.alloc(stat.size);
  await file.read(buffer, 0, buffer.length, 0);

  var audioCtx = new AudioContext();

  var arrayBuffer = new ArrayBuffer(buffer.length);
  var bufferView = new Uint8Array(arrayBuffer);
  for (i = 0; i < buffer.length; i++) {
    bufferView[i] = buffer.readUInt8(i);
  }

  var audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  var source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start(0);
};

// ----- Sounds select
drs = new DrsFile();
filename = resources.dir + "/DATA/sounds.drs";
drs.ls(filename).then((ids) => {
  var select = document.getElementById("wav");

  for (var i = 0; i < ids.length; i++) {
    var option = document.createElement("option");
    option.text = ids[i];
    option.value = ids[i];
    select.appendChild(option);
  }

  select.addEventListener('change', ()=> playSound(select.value, 'sounds.drs'));
});

//----- Terrain select
drs = new DrsFile();
filename = resources.dir + "/DATA/terrain.drs";
drs.ls(filename).then((ids) => {
  var select = document.getElementById("terrain");

  for (var i = 0; i < ids.length; i++) {
    var option = document.createElement("option");
    option.text = ids[i];
    option.value = ids[i];
    select.appendChild(option);
  }

  select.addEventListener('change', ()=> loadTerrain(select.value));
});


//-------- Interface
drs = new DrsFile();
filename = resources.dir + "/DATA/interfac.drs";
drs.ls(filename,"pls").then((ids) => {
  var select = document.getElementById("interfac");

  for (var i = 0; i < ids.length; i++) {
    var option = document.createElement("option");
    option.text = ids[i];
    option.value = ids[i];
    select.appendChild(option);
  }

  select.addEventListener('change', ()=> loadInterface(select.value));
});

//-------- Interface Sounds
drs = new DrsFile();
filename = resources.dir + "/DATA/interfac.drs";
drs.ls(filename, 'vaw').then((ids) => {
  var select = document.getElementById("interfac-wav");

  for (var i = 0; i < ids.length; i++) {
    var option = document.createElement("option");
    option.text = ids[i];
    option.value = ids[i];
    select.appendChild(option);
  }

  select.addEventListener('change', ()=> playSound(select.value, 'interfac.drs'));
});


//--------- Blending modes
var blendingModes;
var mode;
Blendomatic.getBlendingModes().then((modes) =>{
  blendingModes = modes;
  var select = document.getElementById("blending-modes");
  for (var i = 0; i < modes.length; i++) {
    var option = document.createElement("option");
    option.text = i;
    option.value = i;
    select.appendChild(option);
  }
  select.addEventListener('change', ()=> mode = blendingModes[select.value]);
});

document.addEventListener("DOMContentLoaded", function() {
  var c, ctx, doKeyDown, idle;

  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");

  loadModel(2);
  loadTerrain(15009);

  c.addEventListener('click', (e) => {
    var dim = e.target.getBoundingClientRect();
    var x = e.clientX - dim.left;
    var y = e.clientY - dim.top;

    var v = $V([x, y]);

    v = v.subtract(pos);
    orientation = Math.atan2(-v.e(2),v.e(1));
  });

  doKeyDown = function(e) {
  };
  idle = function() {
    if (model){
      ctx.clearRect(0, 0, c.width, c.height);

      // 50706
      // model.draw(pos, orientation, frame);
      // frame = model.nextFrame(frame, 0);
      //
      var i;
      if (mode) {
        for (i = 0; i < mode.alphamasks.length; i++) {
          resources.putImage(mode.alphamasks[i] , $V([
            (i % 10) * 96,
            Math.floor(i / 10) * 48
          ]));
          resources.putImage(mode.bitmasks[i] , $V([
            (i % 10) * 96,
            Math.floor(i / 10) * 48 + 48 * 4
          ]));
        }
      }
      else {
        terrain.draw(pos, 0, frame);

        for (i = 0; i < model.frames.length; i++) {
          model.frames[i].draw($V([50 + 50 * (i % 10), 50 + 60 * Math.floor(i/10) ]));
        }
      }
    }
  };
  window.addEventListener("keydown", doKeyDown, true);
  setInterval(idle, 40);
  return 1;
});
