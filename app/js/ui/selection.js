const UIWidget = require('./ui_widget');

module.exports = class Controls extends UIWidget {

  onBind(map) {
    map.onDidChangeSelection((selected) => {

      if (selected.length > 1) {
        this.eventsUnsuscribe();
        this.eventsSubscribe(selected);
        this.display(selected);
      }
      else {
        this.element.innerHTML = '';
      }
    });
  }

  eventsUnsuscribe() {

  }

  eventsSubscribe(selected) {
    for (var entity of selected) {
    }
  }

  attachClick(img, entity) {
    img.addEventListener('click', (e) => {
      map.setSelected([entity]);
    });
  }

  display(selected) {
    var tr;
    this.element.innerHTML = '';

    tr = document.createElement('tr');

    for (var entity of selected) {
      var td, img, pg;

      td = document.createElement('td');
      img = document.createElement('img');
      img.setAttribute('src', entity.icons.thumbnail);
      this.attachClick(img, entity);
      pg = document.createElement('progress');
      pg.setAttribute('value', entity.properties.hitPoints);
      pg.setAttribute('max', entity.properties.maxHitPoints);
      pg.classList.add('hit-points-bar');
      td.classList.add('player' + entity.player.id);

      td.appendChild(img);
      td.appendChild(pg);

      tr.appendChild(td);
    }
    this.element.appendChild(tr);
  }

};
