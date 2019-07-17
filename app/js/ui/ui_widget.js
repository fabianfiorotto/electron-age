const fs = require('fs');

module.exports = class UIWidget {

  template() {
    return null;
  }

  async loadSlpImgs(root) {
    var imgs = root.getElementsByClassName('slp-image');
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

  bind(map, element) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }

    var templateName = this.template();

    if (templateName) {
      fs.readFile('./app/js/ui/' + templateName + '.html', (err, data) => {
        if (err) {
          console.log(err);
        }
        element.innerHTML = data;
        this.loadSlpImgs(element);
        this.onBind(map, element);
        this.loadResources(resources);
      });
    }
    else {
      this.onBind(map, element);
      this.loadResources(resources);
    }
  }

  async loadResources(res) {
  }

};
