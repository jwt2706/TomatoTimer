const Applet = imports.ui.applet;

function MyApplet(orientation, panelHeight, instanceId) {
  this._init(orientation, panelHeight, instanceId);
}

MyApplet.prototype = {
  __proto__: Applet.TextApplet.prototype,

  _init: function (orientation, panelHeight, instanceId) {
    Applet.TextApplet.prototype._init.call(
      this,
      orientation,
      panelHeight,
      instanceId
    );

    this.set_applet_label("Hello, world!");
  },
};

function main(metadata, orientation, panelHeight, instanceId) {
  return new MyApplet(orientation, panelHeight, instanceId);
}
