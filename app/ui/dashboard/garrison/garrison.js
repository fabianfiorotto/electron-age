const UIWidget = require('../../ui_widget');

module.exports = class Garrison extends UIWidget {

  bindMap(map) {
    map.onDidChangeSelection((selected) => {

      if (selected.length == 1) {
        this.eventsUnsuscribe();
        this.eventsSubscribe(selected[0]);
        this.display(selected[0]);
      }
      else {
        this.element.innerHTML = '';
      }
    });
  }

  eventsUnsuscribe() {
    if (this.eventSubrition) {
      this.eventSubrition.dispose();
      this.eventSubrition = null;
    }
  }

  eventsSubscribe(selected) {
    this.eventSubrition = selected.onGarrisonChange(() => this.display(selected));
  }

  attachEvents(img, selected ,entity) {
    img.addEventListener('click', (e) => {
      selected.ungarrison(entity);
    });
  }

  display(selected) {
    var tr;
    this.element.innerHTML = '';

    tr = document.createElement('tr');

    for (var entity of selected.garrisonedEntities) {
      var td, img, pg;

      td = document.createElement('td');
      img = document.createElement('img');
      img.setAttribute('src', entity.icons.thumbnail);
      pg = document.createElement('progress');
      pg.setAttribute('value', entity.properties.hitPoints);
      pg.setAttribute('max', entity.properties.maxHitPoints);
      pg.classList.add('hit-points-bar');
      td.classList.add('player' + entity.player.id);
      this.attachEvents(img, selected, entity);


      td.appendChild(img);
      td.appendChild(pg);

      tr.appendChild(td);
    }
    this.element.appendChild(tr);
  }

};
