const UIWidget = require('../ui_widget');

const SimplePainter = require('../../painters/simple');
const SmartPainter = require('../../painters/smart');

module.exports = class DebugInfo extends UIWidget {

  template() {
    return 'debug';
  }

  constructor() {
    super();
    this.fps = 0;

    this.simplePainter = new SimplePainter();
    this.smartPainter = new SmartPainter();

    // resources.painter = this.simplePainter;
    resources.painter = this.smartPainter;
  }

  onBind(map, $) { //Map no tiene sentido aca...
    this.showFps = $("#fps");
    this.toggleSmartPainter = $('#smart');


    this.toggleSmartPainter.checked = resources.painter === this.smartPainter;

    this.toggleSmartPainter.addEventListener('change', (e) => {
      resources.painter = e.target.checked ? this.smartPainter : this.simplePainter;
      mapView.refreshMap();
    });
  }

  incFps(){
    this.fps += 1;
  }

  resetFps() {
    this.showFps.textContent = this.fps;
    this.fps = 0;
  };

}
