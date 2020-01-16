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

  bind(map, element) {
    if (typeof element === 'string') {
      this.element = document.getElementById(element);
    }
    else {
      this.element = element;
    }

    var templateName = this.template();

    if (templateName) {
      fs.readFile('./app/js/ui/' + templateName + '.html', (err, data) => {
        if (err) {
          console.log(err);
        }
        this.element.innerHTML = data;
        this.loadSlpImgs();
        this.onBind(map, this.element);
        this.loadResources(resources);
      });
    }
    else {
      this.onBind(map);
      this.loadResources(resources);
    }
  }

  async loadResources(res) {
  }

};
