const UIWidget = require('./ui_widget');

module.exports = class Controls extends UIWidget {

  onBind(map) {

    // Los fondos estan en 51141
    // Usar los de mayor resolucion

    map.onDidChangeSelection((selected) => {
      if (selected.length == 1) {
        this.eventsUnsuscribe();
        this.eventsSubscribe(selected[0]);
        this.displayControls(selected[0], selected[0].getControls());
      }
    });
  }


  eventsUnsuscribe() {
    if (this.changeAgeSubscription) {
      this.changeAgeSubscription.dispose();
      this.changeAgeSubscription = null;
    }
    if (this.devTecSubscription) {
      this.devTecSubscription.dispose();
      this.devTecSubscription = null;
    }
  }

  eventsSubscribe(selected) {
    this.changeAgeSubscription = selected.player.onDidChangeAge(() => {
      if (this.sounds.newAge) {
        resources.playSound(this.sounds.newAge);
      }
      this.displayControls(selected, selected.getControls());
    });
    this.devTecSubscription = selected.player.onDidDevelopTecnology(() => {
      this.displayControls(selected, selected.getControls());
    });
  }

  displayControlImage(selected, control, controls) {
    var img = document.createElement('img');
    img.setAttribute('src', control.icon);
    if (control.callback) {
      img.addEventListener('click', (e) => {
        if (control.cost) {
          if (selected.player.canAfford(control.cost)) {
            selected.player.transfer(null, control.cost);
          }
          else {
            resources.playSound(this.sounds.noEnoughResources);
            return;
          }
        }
        resources.playSound(this.sounds.click);
        if (control.time) {

          selected.operationInit(control);
          if (typeof control.prepare === "function") {
            control.prepare.call(selected);
          }
          var t = setInterval(() => selected.operationStep(), 1000);
          setTimeout(()=> {
            clearInterval(t);
            control.callback.call(selected);
            selected.operationComplete();
          }, control.time * 1000);
        }
        else {
          control.callback.call(selected);
        }
      });
    }
    else {
      img.addEventListener('click', (e) => {
        resources.playSound(this.sounds.click);
        this.displayControls(selected, control.group);
      });
    }
    return img;
  }

  displayControls(selected, controls) {
    var tr;
    this.element.innerHTML = '';
    for (var i = 0; i < 15; i++) {
      var td, img;
      var control;
      if (i % 5 == 0) {
        tr = document.createElement('tr');
        this.element.appendChild(tr);
      }
      if (Array.isArray(controls[i])) {
        control = controls[i].reverse().find((c) => typeof c.condition !== "function" || c.condition());
      }
      else {
        control = controls[i];
      }
      td = document.createElement('td');
      tr.appendChild(td);
      if (control && (typeof control.condition !== "function" || control.condition())) {
        img = this.displayControlImage(selected, control, controls);
        td.appendChild(img);
      }
    }
  }

  async loadResources(res) {
    this.sounds = {};
    this.sounds.click = await res.loadInterfaceSound(50301);
    this.sounds.noEnoughResources = await res.loadInterfaceSound(50303);
    this.sounds.newAge = await res.loadInterfaceSound(50305);
  }


};
