const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const GLib = imports.gi.GLib;

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

    // create a box layout and add the entries to it
    this.timerBox = new St.BoxLayout();
    this.timerBox.add(this._createEntryBox(this.hoursEntry));
    this.timerBox.add(this._createEntryBox(this.minutesEntry));
    this.timerBox.add(this._createEntryBox(this.secondsEntry));

    // create a start button and add it to the box layout
    this.startButton = new St.Button({ label: "Start" });
    this.startButton.set_style(
      "padding: 10px; font-size: 20px; background-color: #4CAF50; color: white;"
    );
    this.startButton.connect("clicked", () => this._startTimer());

    // create a pause/resume button and add it to the box layout
    this.pauseResumeButton = new St.Button({ label: "Pause" });
    this.pauseResumeButton.set_style(
      "padding: 10px; font-size: 20px; background-color: #FF9800; color: white;"
    );
    this.pauseResumeButton.connect("clicked", () => this._pauseResumeTimer());

    // create a box layout for the buttons and add it to the menu
    this.buttonsBox = new St.BoxLayout();
    this.buttonsBox.add(this.startButton);
    this.buttonsBox.add(this.pauseResumeButton);
    this.menu.box.add(this.buttonsBox);

    this.menu.addMenuItem(new PopupMenu.PopupBaseMenuItem({ activate: false }));
    this.menu.box.add(this.timerBox);
  },

  _createEntry: function () {
    const entry = new St.Entry({ text: "00" });
    entry.set_style("font-size: 40px");
    entry.clutter_text.set_editable(true);
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
    const timerDuration = this._parseTime(
      this.hoursEntry.get_text(),
      this.minutesEntry.get_text(),
      this.secondsEntry.get_text()
    );
    this.remainingTime = timerDuration;
    this._updateLabel();
    this._resumeTimer();
  },

  _resumeTimer: function () {
    if (this.timerId) {
      GLib.source_remove(this.timerId);
    }
    this.timerId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
      this.remainingTime--;
      this._updateLabel();
      if (this.remainingTime <= 0) {
        global.log("Timer finished!");
        this.set_applet_label("No time set");
        return GLib.SOURCE_REMOVE;
      }
      return GLib.SOURCE_CONTINUE;
    });
  },

  _pauseResumeTimer: function () {
    if (this.timerId) {
      GLib.source_remove(this.timerId);
      this.timerId = null;
      this.pauseResumeButton.set_label("Resume");
    } else {
      this._resumeTimer();
      this.pauseResumeButton.set_label("Pause");
    }
  },

  _updateLabel: function () {
    const hours = Math.floor(this.remainingTime / 3600);
    const minutes = Math.floor((this.remainingTime % 3600) / 60);
    const seconds = this.remainingTime % 60;
    this.set_applet_label(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
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
