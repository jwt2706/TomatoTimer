const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

function TomatoTimer(orientation, panelHeight, instanceId) {
  this._init(orientation, panelHeight, instanceId);
}

TomatoTimer.prototype = {
  __proto__: Applet.TextApplet.prototype,

  _init: function (orientation, panelHeight, instanceId) {
    Applet.TextApplet.prototype._init.call(
      this,
      orientation,
      panelHeight,
      instanceId
    );

    this.set_applet_label("No time set");

    this.menu = new Applet.AppletPopupMenu(this, orientation);
    this.menuManager = new PopupMenu.PopupMenuManager(this);
    this.menuManager.addMenu(this.menu);

    // create three text entry fields for the timer duration
    this.hoursEntry = this._createEntry();
    this.minutesEntry = this._createEntry();
    this.secondsEntry = this._createEntry();

    // create a box layout and add the entries and ":" labels to it
    this.timerBox = new St.BoxLayout();
    this.timerBox.add(this._createEntryBox(this.hoursEntry));
    this.timerBox.add(new St.Label({ text: ":" }));
    this.timerBox.add(this._createEntryBox(this.minutesEntry));
    this.timerBox.add(new St.Label({ text: ":" }));
    this.timerBox.add(this._createEntryBox(this.secondsEntry));

    this.menu.addMenuItem(new PopupMenu.PopupBaseMenuItem({ activate: false }));
    this.menu.box.add(this.timerBox);
  },

  _createEntry: function () {
    const entry = new St.Entry({ text: "00" });
    entry.set_style("font-size: 40px");
    entry.clutter_text.set_editable(true);
    entry.clutter_text.connect("activate", () => this._startTimer());
    return entry;
  },

  _createEntryBox: function (entry) {
    const box = new St.BoxLayout({ vertical: true });

    const upButton = new St.Button({ label: "▲" });
    upButton.connect("clicked", () => {
      const value = Math.min(99, parseInt(entry.get_text()) + 1);
      entry.set_text(value.toString().padStart(2, "0"));
    });

    const downButton = new St.Button({ label: "▼" });
    downButton.connect("clicked", () => {
      const value = Math.max(0, parseInt(entry.get_text()) - 1);
      entry.set_text(value.toString().padStart(2, "0"));
    });

    box.add(upButton);
    box.add(entry);
    box.add(downButton);

    return box;
  },

  _startTimer: function () {
    const timerDuration =
      this._parseTime(
        this.hoursEntry.get_text(),
        this.minutesEntry.get_text(),
        this.secondsEntry.get_text()
      ) * 1000;
    setTimeout(() => {
      global.log("Timer finished!");
      this.set_applet_label("No time set");
    }, timerDuration);
    this.set_applet_label(
      `${this.hoursEntry.get_text()}:${this.minutesEntry.get_text()}:${this.secondsEntry.get_text()}`
    );
  },

  _parseTime: function (hoursString, minutesString, secondsString) {
    return +hoursString * 60 * 60 + +minutesString * 60 + +secondsString;
  },

  on_applet_clicked: function () {
    this.menu.toggle();
  },
};

function main(metadata, orientation, panelHeight, instanceId) {
  return new TomatoTimer(orientation, panelHeight, instanceId);
}
