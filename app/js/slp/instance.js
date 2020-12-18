module.exports = class SlpModelInstance {

  constructor(entity, model) {
    this.entity = entity;
    this.model = model;
    this.pos = $V([0, 0]);
    this.frame = 0;
  }

  drawAt(pos, ctx) {
    this.model.draw(pos, this.entity.orientation, this.frame, this.entity.player.id, ctx);
  }

  draw(camera, ctx) {
    let entity = this.entity;
    let pos = this.pos.add(entity.pos).subtract(camera);
    this.model.draw(pos, entity.orientation, this.frame, entity.player.id , ctx);
  }

  canClick(pos)  {
    let pos1 = this.pos.add(this.entity.pos).subtract(pos);
    return this.model.canClick(pos1, this.entity.orientation, this.frame);
  }

  nextFrame() {
    this.frame = this.model.nextFrame(this.frame, this.entity.orientation);
    return this.frame;
  }

  reset() {
    this.frame = 0;
  }

  randomFrame() {
    this.frame = Math.floor(Math.random() * this.model.frames.length);
    return this.frame;
  }

  progressFrame(prog) {
    this.frame = Math.floor(this.model.frames.length * prog);
    this.frame = Math.min(this.frame, this.model.frames.length - 1)
    return this.frame
  }

  loadColors(pallete = 50505) {
    this.model.load({
      base: resources.palettes[pallete],
      player: this.entity.player.id
    })
  }

}
