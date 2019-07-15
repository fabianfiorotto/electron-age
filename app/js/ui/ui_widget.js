const fs = require('fs');

module.exports = class UIWidget {

  template() {
    return NULL;
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

  bind(map, elementId) {
    var templateName = this.template();
    var element = document.getElementById(elementId);
    if (templateName) {
      fs.readFile('./app/js/ui/' + templateName + '.html', (err, data) => {
        if (err) {
          console.log(err);
        }
        element.innerHTML = data;
        this.loadSlpImgs(element);
        this.onBind(map, element);
      });
    }
    else {
      this.onBind(map, element);
    }
  }

  async loadResources(res) {
  }

};
