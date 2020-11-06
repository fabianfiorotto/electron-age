const fs = require('fs');

module.exports = class UIWidget {

  template() {
    return null;
  }

  async loadSlpImgs() {
    var imgs = this.element.getElementsByClassName('slp-image');
    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].getAttribute('src');
      var [id, frame] = src.split('/');
      var m = await resources.loadInterface(id.substr(1));
      m.load({
        base: resources.palettes[50505],
        player: 0
      });
      imgs[i].setAttribute('src', m.frames[frame || 0].getUrl());
    }
  }

  onBind(map) {
  }

  bind(element) {
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
      fs.readFile('./app/ui/' + templateName + '/' + last + '.html', (err, data) => {
        if (err) {
          console.log(err);
        }
        this.element.innerHTML = data;
        this.loadSlpImgs();
        this.onBind($);
        this.loadResources(resources);
      });
    }
    else {
      this.onBind($);
      this.loadResources(resources);
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
