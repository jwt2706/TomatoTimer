const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

function YourApplet(orientation, panelHeight, instanceId) {
  this._init(orientation, panelHeight, instanceId);
}

YourApplet.prototype = {
  __proto__: Applet.TextApplet.prototype,

  _init: function (orientation, panelHeight, instanceId) {
    Applet.TextApplet.prototype._init.call(
      this,
      orientation,
      panelHeight,
      instanceId
    );

    this.set_applet_label("No time set");

    // popup menu
    this.menu = new Applet.AppletPopupMenu(this, orientation);
    this.menuManager = new PopupMenu.PopupMenuManager(this);
    this.menuManager.addMenu(this.menu);

    // create a text entry field for the timer duration
    this.timerEntry = new St.Entry({ text: "Enter timer duration in seconds" });
    this.menu.addMenuItem(new PopupMenu.PopupBaseMenuItem({ activate: false }));
    this.menu.box.add(this.timerEntry);

    // add an event listener for the 'activate' event
    this.menu.connect("open-state-changed", (menu, isOpen) => {
      if (isOpen) {
        const timerDuration = parseInt(this.timerEntry.get_text()) * 1000;
        setTimeout(() => {
          global.log("Timer finished!");
          this.set_applet_label("No time set");
        }, timerDuration);
        this.set_applet_label(this.timerEntry.get_text() + " seconds");
      }
    });
  },

  on_applet_clicked: function () {
    this.menu.toggle();
  },
};

function main(metadata, orientation, panelHeight, instanceId) {
  return new YourApplet(orientation, panelHeight, instanceId);
}
