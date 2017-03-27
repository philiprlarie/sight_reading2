// Model.Melody class. Creates a random melody with 'new Melody();'
// Model.Note class

var Model = window.Model || (window.Model = {});
var Utils = window.Utils || (window.Utils = {});

Model.setNewMelody = function (clef) {
  this.melody = new Melody(clef);
};

Model.resetMelodyPlayedCorrectly = function () {
  this.melody.resetPlayedCorreclty();
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

function Melody (clef, type) {
  var pitches;
  switch (clef) {
    case 'treble':
      pitches = Utils.TREBLE_CLEF_PITCHES;
      break;
    case 'bass':
      pitches = Utils.BASS_CLEFF_PITCHES;
      break;
    default:
      pitches = Utils.ALL_PITCHES;
  }

  switch (type) {
    case 'QUARTER_AND_EIGHT_NOTES':
      createMelodyQuarterAndEightNotes.call(this, pitches, 16);
      break;
    case 'QUARTER_NOTES':
    default:
      createMelodyQuarterNotes.call(this, pitches, 16);
  }
}

Melody.prototype.addNote = function (note) {
  note.timing = this.totDur;
  this.notes.push(note);
  this.totDur += note.dur;
};

Melody.prototype.removeLastNote = function () {
  var removedNote = this.notes.pop();
  this.totDur -= removedNote.dur;
};

Melody.prototype.resetPlayedCorreclty = function () {
  this.notes.forEach(function (note) {
    note.isPlayedCorrectly = undefined;
  });
};

function createMelodyQuarterNotes (pitches, melodyDuration, countOffDuration) {
  // melodyDuration in beats (quarter note beats)
  this.notes = [];
  this.totDur = 0;

  if (!(countOffDuration === 0)) {
    countOffDuration = countOffDuration || 4;
  }
  for (var countOff = 0; countOff < countOffDuration; countOff++) {
    this.addNote(new Note('tick', 1));
  }

  while (this.totDur < melodyDuration + countOffDuration) {
    var note = new Note(pitches.sample(), 1);
    this.addNote(note);
  }
}

function createMelodyQuarterAndEightNotes (pitches, melodyDuration, countOffDuration) {
  // melodyDuration in beats (quarter note beats)
  this.notes = [];
  this.totDur = 0;

  if (!(countOffDuration === 0)) {
    countOffDuration = countOffDuration || 4;
  }
  for (var countOff = 0; countOff < countOffDuration; countOff++) {
    this.addNote(new Note('tick', 1));
  }

  var possibleNoteDurations = [0.5, 1];
  var note;
  while (this.totDur < melodyDuration + countOffDuration) {
    note = new Note(pitches.sample(), possibleNoteDurations.sample());
    this.addNote(note);
  }

  if (this.totDur > melodyDuration + countOffDuration) {
    this.removeLastNote();
    note = new Note(pitches.sample(), 0.5);
    this.addNote(note);
  }
}
