var Controller = window.Controller || (window.Controller = {});
var Model = window.Model || (window.Model = {});
var Utils = window.Utils || (window.Utils = {});
var View = window.View || (window.View = {});
var audioContext = window.audioContext || (window.audioContext = new AudioContext());

Controller.tempo = 60;

Controller.currentlyPlaying = false;

Controller.play = function () {
  var self = this;
  Controller.requestResetPressedNotes();
  if (!Model.melody) {
    throw 'Controller::play there is no melody';
  }
  self.currentlyPlaying = true;

  var melody = Model.melody;
  var beatLength = 1 / (self.tempo) * 60 * 1000; // milliseconds
  var startTime = new Date().getTime();
  var notesPlayed = 0;
  var noteListeningBuffer = 250; // milliseconds before/after note sounds where we register note being played

  function startNoteHandlerAndSetUpEnd () {
    var curNote = melody.notes[notesPlayed];

    // play current note at correct time
    var curNoteTimingMs = curNote.timing * beatLength;
    var curTime = new Date().getTime();
    var notePlayDelay = curNoteTimingMs - (curTime - startTime);
    setTimeout(playNote.bind(null, curNote), notePlayDelay);

    var noteEndDelay = notePlayDelay + noteListeningBuffer;
    var nextNote = melody.notes[notesPlayed + 1];
    if (nextNote) {
      var nextNoteTimingMs = nextNote.timing * beatLength;
      var midNoteTimingMs = (nextNoteTimingMs + curNoteTimingMs) / 2; // halfway between curNote and nextNote
      var midNoteDelay = midNoteTimingMs - (curTime - startTime);
      noteEndDelay = Math.min(noteEndDelay, midNoteDelay);
    }
    setTimeout(endNoteHandlerAndSetUpNextStart, noteEndDelay);
  }

  function endNoteHandlerAndSetUpNextStart () {
    var curNote = melody.notes[notesPlayed];
    if (Controller.checkNotePlayed(curNote)) {
      curNote.isPlayedCorrectly = true;
    } else {
      curNote.isPlayedCorrectly = false;
    }
    Controller.requestDrawNote(curNote);
    Controller.requestResetPressedNotes();

    notesPlayed++;
    var nextNote = melody.notes[notesPlayed];
    if (!nextNote) {
      self.currentlyPlaying = false;
      return;
    }

    var curNoteTimingMs = curNote.timing * beatLength;
    var nextNoteTimingMs = nextNote.timing * beatLength;
    var nextNoteStart = nextNoteTimingMs - noteListeningBuffer;
    var midNoteTimingMs = (nextNoteTimingMs + curNoteTimingMs) / 2; // halfway between curNote and nextNote

    nextNoteStart = Math.max(nextNoteStart, midNoteTimingMs);
    var curTime = new Date().getTime();
    var nextNoteStartDelay = nextNoteStart - (curTime - startTime);
    setTimeout(startNoteHandlerAndSetUpEnd, nextNoteStartDelay);
  }

  startNoteHandlerAndSetUpEnd();
};

Controller.stop = function () {
  Controller.currentlyPlaying = false;
  stopTimeouts();
};

Controller.newMelody = function (clef) {
  Model.setNewMelody(clef);
  View.drawMelody(Model.melody);
};

Controller.setTempo = function (tempo) {
  this.tempo = tempo;
};

Controller.checkNotePlayed = function (note) {
  return View.pressedNotes[note.pitch.slice(0, -1)];
};

Controller.requestResetPressedNotes = function () {
  for (var pitch in View.pressedNotes) {
    if (View.pressedNotes.hasOwnProperty(pitch)) {
      View.pressedNotes[pitch] = false;
    }
  }
};

Controller.requestDrawNote = function (note) {
  View.drawNote(note);
};

function playNote (note) {
  var buffer = Utils.getNoteBuffer(note.pitch);
  var sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = buffer;
  sourceNode.connect(audioContext.destination);
  sourceNode.start(0);
}

function stopTimeouts () {
  var id = window.setTimeout(function () {}, 0); // just to get the correct id
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
}
