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
    this.icon = this.element.getElementsByClassName('progress-icon')[0];
    this.queue = this.element.getElementsByClassName('queue')[0];

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
    var events = [
      'operationInit',
      'operationStep',
      'operationComplete',
      'operationQueueChanged'
    ];
    for (var event of events) {
      if (this[event]) {
        this[event].dispose();
        this[event] = null;
      }
    }
  }

  eventsSubscribe(selected) {
    this.onOperationInit = selected.onOperationInit((control) => {
      this.element.style.display = '';
      this.icon.setAttribute('src', control.icon);
      this.progress.setAttribute('value', control.step);
      this.progress.setAttribute('max', control.time);
    });
    this.operationStep = selected.onOperationStep((control) => {
      this.progress.setAttribute('value', control.step);
    });
    this.operationComplete = selected.onOperationComplete((control) => {
      this.element.style.display = 'none';
    });
    this.operationQueueChanged = selected.onOperationQueueChanged((queue) => {
      this.queue.innerHTML = '';
      for (var i = 0; i < queue.length; i++) {
        this.queue.appendChild(
          this.displayQueueElement(i, queue[i], selected)
        );
      }
    });
  }

  displayQueueElement(i, control, selected) {
    var img = document.createElement('img');
    img.setAttribute('src', control.icon);
    img.addEventListener('click', (e) => {
      selected.queue.splice(i,1);
      selected.emitter.emit('did-operation-queue-changed', selected.queue);
    });
    return img;
  }

};
