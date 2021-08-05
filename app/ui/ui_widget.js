const fs = require('fs').promises;
const {Emitter} = require('event-kit')


module.exports = class UIWidget {

  constructor() {
    document.addEventListener('mapLoaded', (e)=> this.bindMap(e.map), false);
    this.emitter = new Emitter();
  }

  template() {
    return null;
  }

  async loadSlpImgs() {
    var imgs = this.element.getElementsByClassName('slp-image');
    for (var i = 0; i < imgs.length; i++) {
      let img = imgs[i];
      if (img.classList.contains('processed')) {
        continue;
      }
      let src = img.getAttribute('src');
      let [id, frame] = src.split('/');
      let m = await resources.loadInterface(id.substr(1));
      let playerColor = img.getAttribute('data-player-color') || 0;
      m.load({
        base: resources.palettes[50505],
        player: playerColor
      });
      img.setAttribute('src', m.frames[frame || 0].getUrl());
      img.classList.add('processed');
    }
  }

  async loadFormElements() {
    var components = this.element.getElementsByClassName('aoe-component');
    if (components.length) {
      // model = await res.loadInterface(50259);
      let model = await resources.loadInterface(53009);
      model.load({
        base: resources.palettes[50505],
        player: 0
      });

      this.boxUnchecked = model.frames[0].imgs[0];
      this.boxChecked   = model.frames[2].imgs[0];

      this.radioUnchecked = model.frames[4].imgs[0];
      this.radioChecked   = model.frames[6].imgs[0];
    }
    for (var i = 0; i < components.length; i++) {
      let component = components[i];
      let type = component.getAttribute('type');
      if (type == 'radio' || type == 'checkbox') {
        let label = component.closest('label');
        if (!label) {
          label = document.createElement('label');
          component.parentNode.insertBefore(label, component);
          label.appendChild(component);
        }

        let icon = document.createElement('i');
        component.insertAdjacentElement('afterend', icon);
      }
      if (type == 'checkbox') {
        this.updateCheckboxComponent(component);
        component.addEventListener('change',e => this.updateCheckboxComponent(e.target));
      }
      if (type == 'radio') {
        this.updateRadioComponent(component);
        component.addEventListener('change',e => this.updateAllRadioComponents(e.target));
      }

    }
  }

  updateRadioComponent(component) {
    let img = component.checked ? this.radioChecked : this.radioUnchecked;
    component.nextElementSibling.style.backgroundImage = 'url(' + resources.getUrl(img) +')';
  }

  updateAllRadioComponents(component) {
    let name = component.getAttribute('name');
    let components = document.getElementsByName(name);
    for (var i = 0; i < components.length; i++) {
      let img = components[i].checked ? this.radioChecked : this.radioUnchecked;
      components[i].nextElementSibling.style.backgroundImage = 'url(' + resources.getUrl(img) +')';
    }
  }

  updateCheckboxComponent(component) {
    let img = component.checked ? this.boxChecked : this.boxUnchecked;
    component.nextElementSibling.style.backgroundImage = 'url(' + resources.getUrl(img) +')';
  }

  onBind(map) {
  }

  async bind(element) {
    if (typeof element === 'string') {
      this.element = document.getElementById(element);
    }
    else {
      this.element = element;
    }

    var templateName = this.template();
    const $ = this.querySelector.bind(this);

    if (templateName) {
      let parts = templateName.split('/');
      let last = parts[parts.length - 1];
      let data = await fs.readFile('./app/ui/' + templateName + '/' + last + '.html')
      this.element.innerHTML = data;
      await this.loadSlpImgs();
      await this.loadFormElements();
      this.onBind($);
      await this.loadResources(resources);
    }
    else {
      this.onBind($);
      await this.loadResources(resources);
    }
  }

  bindMap(map) {
  }

  querySelector(selector) {
    return this.element.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.element.querySelectorAll(selector);
  }

  async loadResources(res) {
  }

};
