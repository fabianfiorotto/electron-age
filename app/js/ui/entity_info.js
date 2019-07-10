module.exports = class EntityInfo {

  bind(element, map) {
    this.thumbnail = element.getElementsByClassName('thumbnail')[0];
    this.stone = element.getElementsByClassName('unit-stone')[0];
    this.food = element.getElementsByClassName('unit-food')[0];
    this.wood = element.getElementsByClassName('unit-wood')[0];
    this.gold = element.getElementsByClassName('unit-gold')[0];
    this.hitPoints = element.getElementsByClassName('hit-points')[0];

    map.onDidChangeSelection((selected) => {
      if (selected.length == 1) {
        this.eventsUnsuscribe();
        this.eventsSubscribe(selected[0]);
        this.displayInfo(selected[0]);
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
      this.displayPropertiesInfo(pr);
    });
  }

  displayResourcesInfo(res) {
    if (res.food) {
      this.food.parentNode.style.display = '';
      this.food.textContent = res.food;
    }
    else {
      this.food.parentNode.style.display = 'none';
    }
    if (res.stone) {
      this.stone.parentNode.style.display = '';
      this.stone.textContent = res.stone;
    }
    else {
      this.stone.parentNode.style.display = 'none';
    }
    if (res.gold) {
      this.gold.parentNode.style.display = '';
      this.gold.textContent = res.gold;
    }
    else {
      this.gold.parentNode.style.display = 'none';
    }
    if (res.wood) {
      this.wood.parentNode.style.display = '';
      this.wood.textContent = res.wood;
    }
    else {
      this.wood.parentNode.style.display = 'none';
    }
  }

  displayPropertiesInfo(pr) {
    this.hitPoints.textContent = "(" + pr.hitPoints + "/" + pr.maxHitPoints + ")";
  }

  displayInfo(selected) {
     if (selected.icons.thumbnail) {
       this.thumbnail.setAttribute('src', selected.icons.thumbnail);
     }
     else {
       this.thumbnail.setAttribute('src', "#");
     }
     if (selected.resources) {
       this.displayResourcesInfo(selected.resources);
     }
     else {
       this.food.parentNode.style.display = 'none';
     }
     this.displayPropertiesInfo(selected.properties);
  }

};
