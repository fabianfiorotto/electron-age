const UIWidget = require('../../ui_widget');

module.exports = class EntityInfo extends UIWidget {

  template() {
    return 'dashboard/entity_info';
  }

  onBind(map) {
    this.resources = this.element.getElementsByClassName('resources')[0];
    this.thumbnail = this.element.getElementsByClassName('thumbnail')[0];
    this.stone = this.element.getElementsByClassName('unit-stone')[0];
    this.food = this.element.getElementsByClassName('unit-food')[0];
    this.wood = this.element.getElementsByClassName('unit-wood')[0];
    this.gold = this.element.getElementsByClassName('unit-gold')[0];
    this.hitPoints = this.element.getElementsByClassName('hit-points')[0];
    this.hitPointsBar = this.element.getElementsByClassName('hit-points-bar')[0];
    this.attack = this.element.getElementsByClassName('attack')[0];
    this.armor = this.element.getElementsByClassName('armor')[0];
    this.debug = this.element.getElementsByClassName('debug-entity-link')[0];

    this.debug.addEventListener('click', ()=> {
      require('electron').remote.getCurrentWindow().openDevTools();
      map.selected[0].debugger();
    });

    if (map.selected.length == 1) {
      this.element.style.display = '';
      this.eventsUnsuscribe();
      this.eventsSubscribe(map.selected[0]);
      this.displayInfo(map.selected[0]);
    }
    else {
      this.element.style.display = 'none';
    }

    map.onDidChangeSelection((selected) => {
      if (selected.length == 1) {
        this.element.style.display = '';
        this.eventsUnsuscribe();
        this.eventsSubscribe(selected[0]);
        this.displayInfo(selected[0]);
      }
      else {
        this.element.style.display = 'none';
      }
    });
  }


  eventsUnsuscribe() {
    if (this.resourcesSubscription) {
      this.resourcesSubscription.dispose();
      this.resourcesSubscription = null;
    }
    if (this.propertiesSubscription) {
      this.propertiesSubscription.dispose();
      this.propertiesSubscription = null;
    }
  }

  eventsSubscribe(selected) {
    this.resourcesSubscription = selected.onDidChangeResources((res) => {
      this.displayResourcesInfo(res);
    });
    this.propertiesSubscription = selected.onDidChangeProperties((pr) => {
      this.displayPropertiesInfo(pr, selected.defineProperties());
    });
  }

  displayResourcesInfo(res) {
    for (var name of ['food', 'stone', 'gold', 'wood']) {
      if (res[name]) {
        this[name].parentNode.style.display = '';
        this[name].textContent = res[name];
      }
      else {
        this[name].parentNode.style.display = 'none';
      }
    }
  }

  displayPropertiesInfo(pr, org) {
    this.hitPoints.textContent = pr.hitPoints + "/" + pr.maxHitPoints;
    this.hitPointsBar.setAttribute('value', pr.hitPoints);
    this.hitPointsBar.setAttribute('max', pr.maxHitPoints);
    if (pr.attack) {
      this.attack.parentNode.style.display = '';
      this.attack.textContent = org.attack;
      if (org.attack != pr.attack) {
        this.attack.textContent += '+' + (pr.attack - org.attack);
      }
    }
    else {
      this.attack.parentNode.style.display = 'none';
    }
    if (typeof pr.meleeArmor !== 'undefined') {
      this.armor.textContent = org.meleeArmor;
      if (org.meleeArmor != pr.meleeArmor) {
        this.armor.textContent += '+' + (pr.meleeArmor - org.meleeArmor);
      }
      this.armor.textContent += "/" + org.pierceArmor;
      if (org.pierceArmor != pr.pierceArmor) {
        this.armor.textContent += '+' + (pr.pierceArmor - org.pierceArmor);
      }
    }
  }

  displayInfo(selected) {
     if (selected.icons.thumbnail) {
       this.thumbnail.setAttribute('src', selected.icons.thumbnail);
     }
     else {
       this.thumbnail.setAttribute('src', "#");
     }
     if (selected.resources) {
       this.resources.style.display = '';
       this.displayResourcesInfo(selected.resources);
     }
     else {
       this.resources.style.display = 'none';
     }
     this.hitPointsBar.parentNode.setAttribute("class", "player" + selected.player.id);
     this.displayPropertiesInfo(selected.properties, selected.defineProperties());
  }

};
