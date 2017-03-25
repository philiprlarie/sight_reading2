var View = window.View || (window.View = {});
var Controller = window.Controller || (window.Controller = {});
// var Utils = window.Utils || (window.Utils = {});

// Internal state of view
View.pressedNotes = { // true if note pressed in current note listening period. Controller will reset all to false at the start of each period
  Cb: false, C: false, Cs: false,
  Db: false, D: false, Ds: false,
  Eb: false, E: false, Es: false,
  Fb: false, F: false, Fs: false,
  Gb: false, G: false, Gs: false,
  Ab: false, A: false, As: false,
  Bb: false, B: false, Bs: false
};
View.arrowsUpDown = { // functionality for sharps and flats
  downArrow: false, // true if down arrow currently pressed
  upArrow: false // true if up arrow currently pressed
};

// Drawing methods of view
View.drawMelody = function (melody) {
  View.Drawing.drawMelody(melody);
};
View.drawNote = function (note) {
  View.Drawing.drawNote(note);
};

// Event handler methods of view
View.requestPlay = function () {
  Controller.currentlyPlaying || Controller.play();
};
View.requestStop = function () {
  Controller.stop();
};
View.requestTogglePlay = function () {
  Controller.currentlyPlaying ? Controller.stop() : Controller.play();
};
View.requestNewMelody = function (clef) {
  Controller.currentlyPlaying || Controller.newMelody(clef);
};
View.requestSetTempo = function (tempo) {
  Controller.setTempo(tempo);
};
