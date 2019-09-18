const UIWidget = require('./ui_widget');

module.exports = class Controls extends UIWidget {

  constructor() {
    super();
  }

  template() {
    return 'progress';
  }

  onBind(map) {
    this.progress = this.element.getElementsByClassName('the-progress')[0];

    map.onDidChangeSelection((selected) => {
      if (selected.length == 1) {
        if (selected[0].operation) {
          this.element.style.display = '';
          this.progress.setAttribute('value', selected[0].operation.step);
          this.progress.setAttribute('max', selected[0].operation.time);
        }
        else {
          this.element.style.display = 'none';
        }

        this.eventsUnsuscribe();
        this.eventsSubscribe(selected[0]);
      }
      else {
        this.element.style.display = 'none';
      }
    });
  }

  eventsUnsuscribe() {
    if (this.operationInit) {
      this.operationInit.dispose();
      this.operationInit = null;
    }
    if (this.operationStep) {
      this.operationStep.dispose();
      this.operationStep = null;
    }
    if (this.operationComplete) {
      this.operationComplete.dispose();
      this.operationComplete = null;
    }
  }

  eventsSubscribe(selected) {
    this.onOperationInit = selected.onOperationInit((control) => {
      this.element.style.display = '';
      this.progress.setAttribute('value', control.step);
      this.progress.setAttribute('max', control.time);
    });
    this.operationStep = selected.onOperationStep((control) => {
      this.progress.setAttribute('value', control.step);
    });
    this.operationComplete = selected.onOperationComplete((control) => {
      this.element.style.display = 'none';
    });
  }

};
