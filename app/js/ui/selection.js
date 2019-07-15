const UIWidget = require('./ui_widget');

module.exports = class Controls extends UIWidget {

  onBind(map, element) {
    this.selectionView = element;
    map.onDidChangeSelection((selected) => {

      if (selected.length > 1) {
        this.eventsUnsuscribe();
        this.eventsSubscribe(selected);
        this.display(selected);
      }
      else {
        this.selectionView.innerHTML = '';
      }
    });
  }

  eventsUnsuscribe() {

  }

  eventsSubscribe(selected) {
    for (var entity of selected) {
    }
  }

  display(selected) {
    var tr;
    this.selectionView.innerHTML = '';

    tr = document.createElement('tr');

    for (var entity of selected) {
      var td, img, pg;

      td = document.createElement('td');
      img = document.createElement('img');
      img.setAttribute('src', entity.icons.thumbnail);
      pg = document.createElement('progress');
      pg.setAttribute('value', entity.properties.hitPoints);
      pg.setAttribute('max', entity.properties.maxHitPoints);
      pg.classList.add('hit-points-bar');

      td.appendChild(img);
      td.appendChild(pg);

      tr.appendChild(td);
    }
    this.selectionView.appendChild(tr);
  }

};
