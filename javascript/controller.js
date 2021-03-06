var Controller = window.Controller || (window.Controller = {});
var Model = window.Model || (window.Model = {});
var Utils = window.Utils || (window.Utils = {});
var View = window.View || (window.View = {});
var audioContext = window.audioContext || (window.audioContext = new AudioContext());

Controller.tempo = 60;

Controller.currentlyPlaying = false;

Controller.play = function (metronome, countOff) {
  var self = this;
  if (!Model.melody) {
    throw 'Controller::play there is no melody';
  }
  Controller.requestResetMelodyPlayedCorrectly();
  Controller.requestDrawMelody(Model.melody);
  self.currentlyPlaying = true;

  var melody = Model.melody;
  countOff = countOff || 0;
  var beatLength = 1 / (self.tempo) * 60 * 1000; // milliseconds
  var startTime = new Date().getTime();
  var melodyStartTime = startTime + countOff * beatLength;
  var notesPlayed = 0;
  var metronomeClicks = 0;
  var noteListeningBuffer = 250; // milliseconds before/after note sounds where we register note being played

  function playMetronome () {
    // play current note at correct time
    playNote({ pitch: 'tick' });
    metronomeClicks++;
    var nextClickTimingMs = metronomeClicks * beatLength;
    var curTime = new Date().getTime();
    var nextClickDelay = nextClickTimingMs - (curTime - melodyStartTime);

    if (metronomeClicks < melody.totDur) {
      setTimeout(playMetronome, nextClickDelay);
    }
  }

  function startNoteHandlerAndSetUpEnd () {
    Controller.requestResetPressedNotes();
    var curNote = melody.notes[notesPlayed];

    // play current note at correct time
    var curNoteTimingMs = curNote.timing * beatLength;
    var curTime = new Date().getTime();
    var notePlayDelay = curNoteTimingMs - (curTime - melodyStartTime);
    setTimeout(playNote.bind(null, curNote), notePlayDelay);

    var noteEndDelay = notePlayDelay + noteListeningBuffer;
    var nextNote = melody.notes[notesPlayed + 1];
    if (nextNote) {
      var nextNoteTimingMs = nextNote.timing * beatLength;
      var midNoteTimingMs = (nextNoteTimingMs + curNoteTimingMs) / 2; // halfway between curNote and nextNote
      var midNoteDelay = midNoteTimingMs - (curTime - melodyStartTime);
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
    Controller.requestDrawMelody(melody);
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
    var nextNoteStartDelay = nextNoteStart - (curTime - melodyStartTime);
    setTimeout(startNoteHandlerAndSetUpEnd, nextNoteStartDelay);
  }

  var countOffTicksPlayed = 0;
  function playCountOff () {
    if (countOffTicksPlayed >= countOff) {
      if (metronome) {
        playMetronome();
      }
      startNoteHandlerAndSetUpEnd();
      return;
    }
    playNote({ pitch: 'tick' });

    countOffTicksPlayed++;
    var nextClickTimingMs = countOffTicksPlayed * beatLength;
    var curTime = new Date().getTime();
    var nextClickDelay = nextClickTimingMs - (curTime - startTime);

    setTimeout(playCountOff, nextClickDelay);
  }

  playCountOff();
};

Controller.stop = function () {
  Controller.currentlyPlaying = false;
  stopTimeouts();
};

Controller.newMelody = function (clef, type) {
  Model.setNewMelody(clef, type);
  View.drawMelody(Model.melody);
};

Controller.setTempo = function (tempo) {
  this.tempo = tempo;
};

Controller.checkNotePlayed = function (note) {
  if (note.pitch === 'rest') {
    return !Object.values(View.pressedNotes).includes(true);
  }
  return View.pressedNotes[note.pitch.slice(0, -1)];
};

Controller.requestResetPressedNotes = function () {
  for (var pitch in View.pressedNotes) {
    if (View.pressedNotes.hasOwnProperty(pitch)) {
      View.pressedNotes[pitch] = false;
    }
  }
};

Controller.requestDrawMelody = function (melody) {
  View.drawMelody(melody);
};

Controller.requestResetMelodyPlayedCorrectly = function () {
  Model.resetMelodyPlayedCorrectly();
};

function playNote (note) {
  if (note.pitch === 'rest') {
    return;
  }
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
