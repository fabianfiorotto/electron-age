require('../js/entities/types');
const ResourceManager = require("../resources");
window.resources = new ResourceManager();

require("sylvester");

/*

  Cada opcion tiene
  in icono con transparencias
  3 animaciones

  10..13: Single player
  14..17: Multiplayer
  18.. msn zone
  22.. tutorial
  26.. map builder
  30.. help
  34 .. options
  46.. exit
  49 banner
*/

var applyFrame = function(img, frame) {
  img.setAttribute('src', frame.getUrl());
  img.setAttribute('height', frame.height);
  img.setAttribute('width', frame.width);
}

document.addEventListener("DOMContentLoaded", async function() {
  let id = 50189 // <-- conqueror
  // let id = 50231 // <-- kings
  let palette = await resources.loadPalette(50507);
  let model;

  model = await resources.loadInterface(id);
  model.load({base: palette, player: 0});

  applyFrame(document.getElementById('background'),    model.frames[ 0]);
  // applyFrame(document.getElementById('single-player'), model.frames[11]);
  applyFrame(document.getElementById('multiplayer'),   model.frames[14]);
  applyFrame(document.getElementById('msn'),           model.frames[18]);
  applyFrame(document.getElementById('tutorial'),      model.frames[22]);
  applyFrame(document.getElementById('map-builder'),   model.frames[26]);
  applyFrame(document.getElementById('help'),          model.frames[30]);
  applyFrame(document.getElementById('options'),       model.frames[34]);
  applyFrame(document.getElementById('exit'),          model.frames[46]);
  applyFrame(document.getElementById('banner'),        model.frames[49]);


  let _in = document.querySelector('#single-player .in');
  let out = document.querySelector('#single-player .out');

  applyFrame(_in, model.frames[11]);
  applyFrame(out, model.frames[10]);


  let frame = 1;
  let img1 = document.getElementById('slp-image-option');
  img1.setAttribute('src', model.frames[1].getUrl());
  img1.setAttribute('height', model.frames[1].height);
  img1.setAttribute('width', model.frames[1].width);

  let next = document.getElementById('next');
  let current = document.getElementById('current');
  next.addEventListener('click', (e) => {
    e.preventDefault();
    img1.setAttribute('src', model.frames[frame].getUrl());
    img1.setAttribute('height', model.frames[frame].height);
    img1.setAttribute('width', model.frames[frame].width);
    current.textContent = frame;
    frame++;
  });

  console.log(model.frames.length);
});
