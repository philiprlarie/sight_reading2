// Model.Melody class. Creates a random melody with 'new Melody();'
// Model.Note class

var Model = window.Model || (window.Model = {});
var Utils = window.Utils || (window.Utils = {});

Model.setNewMelody = function (clef) {
  this.melody = new Melody(clef);
};

function Note (pitch, dur, timing) {
  this.pitch = pitch;
  this.dur = dur; // how many beats
  this.timing = undefined; // set when Melody adds note
  this.isPlayedCorrectly = undefined; // set when user plays note
}

// needed for generating new melody
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

function Melody (clef) {
  this.notes = [];
  this.totDur = 0;

  for (var countOff = 0; countOff < 4; countOff++) {
    this.addNote(new Note('tick', 1));
  }

  for (var i = 0; i <= 15; i++) {
    clef = clef || 'both';
    var note;
    switch (clef) {
      case 'treble':
        note = new Note(Utils.ALL_PITCHES.slice(13).sample(), 1);
        break;
      case 'bass':
        note = new Note(Utils.ALL_PITCHES.slice(0, 16).sample(), 1);
        break;
      default:
        note = new Note(Utils.ALL_PITCHES.sample(), 1);
    }
    this.addNote(note);
  }
}

Melody.prototype.addNote = function (note) {
  note.timing = this.totDur;
  this.notes.push(note);
  this.totDur += note.dur;
};
