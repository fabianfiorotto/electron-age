const UIWidget = require('../ui_widget');

module.exports = class LoadingScreen extends UIWidget {

  onBind(map, $) {
    this.text = $("#loading-screen-text");
    this.progressBar = $("#loading-screen-progress");
  }

  template() {
    return 'loading';
  }

  progress(value, text) {
    this.text.textContent = text;
    this.progressBar.setAttribute('value', Math.round(value * 100))
  }

  start() {
    if (this.element) {
      this.element.style.display = '';
    }
  }

  complete() {
    this.element.style.display = 'none';
  }

  async loadResources(res) {
    let palette = await resources.loadPalette(50503);
    var model = await res.loadInterface(50100);
    model.load({
      base: palette,
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.element.style.backgroundImage = 'url(' + res.getUrl(img) +')';
  }

}
