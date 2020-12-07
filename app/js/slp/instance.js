module.exports = class SlpModelInstance {

  constructor(entity, model) {
    this.entity = entity;
    this.model = model;
    this.pos = $V([0, 0]);
    this.frame = 0;
  }

  drawAt(pos) {
    this.model.draw(pos, this.entity.orientation, this.frame, this.entity.player.id);
  }

  draw(camera) {
    let entity = this.entity;
    let pos = this.pos.add(entity.pos).subtract(camera);
    this.model.draw(pos, entity.orientation, this.frame, entity.player.id);
  }

  nextFrame() {
    this.frame = this.model.nextFrame(this.frame, this.entity.orientation);
  }

  reset() {
    this.frame = 0;
  }

  loadColors(pallete = 50505) {
    this.model.load({
      base: resources.palettes[pallete],
      player: this.entity.player.id
    })
  }

}
