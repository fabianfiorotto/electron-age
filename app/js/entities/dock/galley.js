const Unit = require('../unit');
module.exports = class Galley extends Unit {

  modelsResources() {
    return {
      unit: {
        //Faltan orientaciones aca :(
        hull: 4300,
        // sail: 4224 // Central/North european
        // sail: 4225 // Asian
        // sail: 4226 // Arabic
        // sail: 4227 // West European


        // sail: 4245 // North European sail sequences
        // sail: 4301 // North European ships main sail sequence
        // sail: 4598 // North European ships main sail sequence
        // sail: 4309 // North European ships sail
        // sail: 4317 // North European ships sail.
        // sail: 4305 // North European ships small triangular sail.
        // sail: 4236 // North European small sail sequence
        // sail: 4228 // North European Small ships sail sequence
        // sail: 4240 // North European small triangular sail sequence
      }
    };
  }

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.pos.subtract(camera), this.orientation, this.getFrame(), this.player.id);
    }
    if (this.models.sail) {
      this.models.sail.draw(this.pos.subtract(camera), this.orientation, this.getFrame(), this.player.id);
    }
  }

  thumbnail() {
    return 87;
  }

  getModel() {
    return this.models.hull;
  }

  getFrame() {
    return 0;
  }

};
