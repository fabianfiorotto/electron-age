const fs = require('fs').promises;

module.exports = class UIWidget {

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
      this.loadSlpImgs();
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

  async loadResources(res) {
  }

};
