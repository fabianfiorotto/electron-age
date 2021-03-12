require('./js/entities/types');
const ResourceManager = require("./resources");
const remote = require('electron').remote;

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

var createOption = function(id, frames, fid) {
  let option = document.createElement('a');
  option.setAttribute('href', '#');
  option.classList.add('option');
  option.setAttribute('id' , id);

  let _in = document.createElement('img');
  applyFrame(_in, frames[fid+1]);
  _in.classList.add('in');

  let out = document.createElement('img');
  applyFrame(out, frames[fid]);
  out.classList.add('out');

  option.appendChild(_in);
  option.appendChild(out);
  return option;
}

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

  let wrapper = document.querySelector('.inner');
  wrapper.appendChild(createOption('single-player', model.frames, 10));
  wrapper.appendChild(createOption('multiplayer'  , model.frames, 14));
  wrapper.appendChild(createOption('msn'          , model.frames, 18));
  wrapper.appendChild(createOption('tutorial'     , model.frames, 22));
  wrapper.appendChild(createOption('map-builder'  , model.frames, 26));
  wrapper.appendChild(createOption('help'         , model.frames, 30));
  wrapper.appendChild(createOption('options'      , model.frames, 34));
  wrapper.appendChild(createOption('exit'         , model.frames, 46));
  wrapper.appendChild(createOption('banner'       , model.frames, 49));

  let singlePlayer = document.getElementById('single-player');
  singlePlayer.setAttribute('href', './local_game/index.html');

  let exit = document.getElementById('exit');
  exit.addEventListener('click', (e) => {
    remote.getCurrentWindow().close();
  });

});
