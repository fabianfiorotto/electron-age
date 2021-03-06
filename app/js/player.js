const {Emitter} = require('event-kit');

module.exports = class Player {

  constructor(map, civilization, id) {
    this.map = map;
    this.civilization = civilization;
    this.resources = {
      food: 10000,
      wood: 10000,
      stone: 10000,
      gold: 10000
    };
    this.population = 0;
    this.maxPopulation = 0;
    this.age = 1;
    this.name = "Player " + id;
    this.technologies = {};
    this.builderSpeedBonus = 0;

    this.emitter = new Emitter();

    this.id = id;
    this.number = id;

    this.onDidChangeAge(() => this.onChangeAge());
    this.onDidDevelopTechnology((tec) => this.onDevelopTechnology(tec));

    this.resetSight();
    this.refresh_seight = true;
    this.seight_old = this.seight;

    this.seight_memory = Array.from({length: this.map.width}, () => {
      return Array.from({length: this.map.height}, () => null );
    });
    const black = [0,0,0];
    this.minimap_seight_memory = Array.from({length: this.map.width}, () => {
      return Array.from({length: this.map.height}, () => black );
    });
  }


  resetSight() {
    this.seight = Array.from({length: this.map.width}, () => {
      return Array.from({length: this.map.height}, () => false );
    });
  }

  refreshSeight() {
    let entities = this.map.getPlayerEntities(this);
    for (let entity of entities) {
      let pos = this.map.terrain.mr.x(entity.pos);
      pos = pos.map((e) => Math.floor(e));
      let i1 = pos.e(1), j1 = pos.e(2);
      let r = entity.properties.lineofSeight || 1;
      for (let i = -r; i <= r; i++) {
        if (i+i1 >= 0 && i+i1 < this.map.width) {
          for (let j = -r; j <= r; j++) {
            if (j+j1 >= 0 && j+j1 < this.map.height && i*i + j*j <= r*r ) {
              this.seight[i+i1][j+j1] = true;
            }
          }
        }
      }
    }
  }

  updateSeight() {
    this.seight_old = this.seight;
    this.resetSight();
    this.refreshSeight();
    this.refresh_seight = true;
  }

  drawLineOfSeightMemory(camera, i, j) {
    if (!this.seight_memory[i][j]) {
      return;
    }
    const ctx = resources.getFog2DContext();
    const terrain = this.map.terrain;

    let tile = this.seight_memory[i][j];
    let pos1 = terrain.tileImgPos(i,j).subtract(camera);
    ctx.globalCompositeOperation = 'source-over';
    resources.drawImage(tile, pos1, ctx);
  }

  drawLineOfSeight(camera, redraw) {
    if (!this.refresh_seight && !redraw) {
      return false;
    }
    if (redraw) {
      resources.clearFog();
    }

    const ctx = resources.getFog2DContext();
    const terrain = this.map.terrain;
    for (let i = 0; i < this.map.width; i++) {
      for (let j = 0; j < this.map.height; j++) {
        if (this.seight[i][j] && (!this.seight_old[i][j] || redraw)) {
          let pos = terrain.tileImgPos(i, j);
          pos = pos.subtract(camera);
          resources.drawLineOfSeight(pos);
          terrain.drawTile(i, j, camera); // TODO don't draw more than once.
          this.seight_memory[i][j] = null;
        }
        if (!this.seight[i][j] && this.seight_old[i][j]) {
          this.seight_memory[i][j] = this.createSeightMemory(i, j);
          this.drawLineOfSeightMemory(camera, i, j);
        }
        else if (redraw) {
          this.drawLineOfSeightMemory(camera, i, j)
        }
      }
    }
    this.refresh_seight = false;
  }

  createSeightMemory(i, j) {
    const terrain = this.map.terrain;
    let tile = terrain.tiles[i][j].frame.img;

    const w = tile.width;
    const h = tile.height;

    var ctx = resources.getFogAux2DContext();
    ctx.globalCompositeOperation = 'source-over';
    ctx.canvas.setAttribute('width', w);
    ctx.canvas.setAttribute('height', h);
    ctx.clearRect(0, 0, w, h);
    let camera = terrain.tileImgPos(i,j);
    terrain.drawTile(i, j, camera, ctx)
    this.map.drawMemory(camera, ctx);

    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.rect(0, 0, w, h);
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo( w / 2, 0);
    ctx.lineTo( w, h / 2);
    ctx.lineTo( w / 2, h);
    ctx.lineTo( 0, h / 2);
    ctx.lineTo( w / 2, 0);
    ctx.rect(w, 0, -w, h);
    ctx.fill();

    tile = ctx.getImageData(0, 0, w, h);

    return tile;
  }

  minimapDrawLineOfSeight(img, redraw) {
    for (let i = 0; i < this.map.width; i++) {
      for (let j = 0; j < this.map.height; j++) {
        if (!this.seight[i][j] && this.seight_old[i][j]) {
          let des = img.width * i + j;
          this.minimap_seight_memory[i][j] = img.data.slice(4 * des, 4 * des + 4)
        }
        if (!this.seight[i][j]) {
          let x =  0.5 * i + 0.5 * j;
          let y =  0.5 * i - 0.5 * j + img.height / 2;
          let des = Math.floor(x) + img.width * Math.floor(y);

          let memory = this.minimap_seight_memory[i][j];
          img.data[4 * des + 0] = memory[0];
          img.data[4 * des + 1] = memory[1];
          img.data[4 * des + 2] = memory[2];
          img.data[4 * des + 3] = 255;
        }
      }
    }
  }

  updgrateAge() {
    if (this.age < 4) {
      this.age++;
      this.emitter.emit('did-change-age', this.age);
    }
  }

  develop(tec, technology = {}) {
    this.technologies[tec] = technology;
    this.emitter.emit('did-develop-technology', tec);
  }

  getDashboardControls(menu, entity) {
    return this.civilization.getDashboardControls(menu, entity);
  }

  onDidChangeResources(callback){
    return this.emitter.on('did-change-resources', callback);
  }

  onDidChangeAge(callback) {
    return this.emitter.on('did-change-age', callback);
  }

  onDidChangePopulation(callback) {
    return this.emitter.on('did-change-population', callback);
  }

  onDidDevelopTechnology(callback) {
    return this.emitter.on('did-develop-technology', callback);
  }


  onEntityMoved(callback) {
    return this.emitter.on('did-entity-moved', callback);
  }

  getAgeCode(age) {
    switch (age || this.age) {
      case 1:
        return "dark";
      case 2:
        return "feudal";
      case 3:
        return "castle";
      case 4:
        return "imperial";
      default:
        return NULL;
    }
  }

  getAgeCodes(minAge = 1) {
    var codes = [];
    minAge = Math.max(this.age, minAge);
    for (var i = 1; i <= minAge; i++) {
      codes.push(this.getAgeCode(i));
    }
    return codes;
  }


  prepareToChangeAge() {
    var entities = this.map.getPlayerEntities(this);
    var age = this.getAgeCode(this.age + 1);
    for (var i = 0; i < entities.length; i++) {
      this.civilization.prepareToChangeAge(age, entities[i]);
    }
  }

  onChangeAge() {
    var entities = this.map.getPlayerEntities(this);
    var age = this.getAgeCode();
    for (var i = 0; i < entities.length; i++) {
      this.civilization.updateAge(age, entities[i]);
    }
  }

  onDevelopTechnology(tec) {
    let technology = this.technologies[tec];
    if (typeof technology.updatePlayer == "function") {
      technology.updatePlayer(this);
    }
    if (typeof technology.updateEntity == "function") {
      let entities = this.map.getPlayerEntities(this);
      for (var i = 0; i < entities.length; i++) {
        technology.updateEntity(entities[i]);
      }
    }
  }

  applyTechnologies(entity) {
    for (const [tec,technology] of Object.entries(this.technologies)){
      if (typeof technology.updateEntity == "function") {
        technology.updateEntity(entity);
      }
    }
  }

  canAfford(quantities) {
    var can = true;
    for (const [key,quantity] of Object.entries(quantities)){
      can &= this.resources[key] >= quantity;
    }
    return can;
  }

  setDiplomacy(player, diplomacy) {
    this.map.setDiplomacy(this, player, diplomacy);
  }

  getDiplomacy(player) {
    return this.map.getDiplomacy(this, player);
  }

  isAlly(player) {
    return this.map.isAlly(this, player);
  }

  transfer(entity, quantities, revert = false) {
    for (const [key,quantity] of Object.entries(quantities)){
      if (revert) {
        if (entity) {
          entity.resources[key] -= quantity;
        }
        this.resources[key] += quantity;
      }
      else {
        if (entity) {
          entity.resources[key] += quantity;
        }
        this.resources[key] -= quantity;
      }
    }
    this.emitter.emit('did-change-resources', this.resources);
    if (entity) {
      entity.emitter.emit('did-change-resources', entity.resources);
    }
  }

  destroy() {
    this.emitter.dispose();
  }

  getMinimapColor() {
    switch (this.id) {
      case 1:
        return '#0000ff';
      case 2:
        return '#ff0000';
      default:
        return '#cccccc';
    }
  }

};
