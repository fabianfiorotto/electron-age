const UIWidget = require('../../ui_widget');

module.exports = class Controls extends UIWidget {

  bindMap(map) {

    // Los fondos estan en 51141
    // Usar los de mayor resolucion

    map.onDidChangeSelection((selected) => {
      if (selected.length == 1) {
        this.eventsUnsuscribe();
        this.eventsSubscribe(selected[0]);
        this.displayControls(selected[0], selected[0].getDashboardControls('main'));
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
      this.displayControls(selected, selected.getDashboardControls('main'));
    });
    this.devTecSubscription = selected.player.onDidDevelopTechnology(() => {
      this.displayControls(selected, selected.getDashboardControls('main'));
    });
  }

  displayControlImage(selected, control, controls) {
    var img = document.createElement('img');
    img.setAttribute('src', control.icon);
    if (control.callback) {
      img.addEventListener('click', (e) => {
        var init = selected.operationInit(control);
        if (init) {
          resources.playSound(this.sounds.click);
        }
        else {
          resources.playSound(this.sounds.noEnoughResources);
        }
      });
    }
    else {
      img.addEventListener('click', (e) => {
        resources.playSound(this.sounds.click);
        this.displayControls(selected, selected.getDashboardControls(control.menu));
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
      control = controls[i];
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
