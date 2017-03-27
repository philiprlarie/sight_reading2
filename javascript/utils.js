var Utils = window.Utils || (window.Utils = {});
var audioContext = window.audioContext || (window.audioContext = new AudioContext());

// two constants. ALL_PITCHES and NOTE_POS
Utils.ALL_PITCHES = [];
var letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
var numbers = ['2', '3', '4', '5'];
numbers.forEach(function (num) {
  letters.forEach(function (letter) {
    Utils.ALL_PITCHES.push(letter + num);
  });
});
Utils.TREBLE_CLEF_PITCHES = Utils.ALL_PITCHES.slice(13);
Utils.BASS_CLEFF_PITCHES = Utils.ALL_PITCHES.slice(0, 16);

// the position of the note pitches relative to middle c
Utils.NOTE_POS = {};
for (var i = 0; i < Utils.ALL_PITCHES.length; i++) {
  Utils.NOTE_POS[Utils.ALL_PITCHES[i]] = i - Utils.ALL_PITCHES.length / 2;
}

// on load, set all note buffers
Utils.NOTE_BUFFERS = {};
Utils.METRONOME_TICK_BUFFER;
function setNoteBuffer (noteName) {
  if (!Utils.NOTE_POS.hasOwnProperty(noteName) && noteName !== 'tick') {
    throw 'Utils.setNoteBuffer:: noteName does not exist.';
  }
  var request = new XMLHttpRequest();
  request.open('GET', './note_mp3s/' + noteName + '.mp3', true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    audioContext.decodeAudioData(request.response, function (buffer) {
      Utils.NOTE_BUFFERS[noteName] = buffer;
    });
  };
  request.send();
}
Utils.ALL_PITCHES.forEach(setNoteBuffer);
setNoteBuffer('tick');

Utils.getNoteBuffer = function (noteName) {
  if (!Utils.NOTE_BUFFERS.hasOwnProperty(noteName)) {
    throw 'Utils.setNoteBuffer:: noteName does not exist.';
  }
  return Utils.NOTE_BUFFERS[noteName];
};

Utils.validPitch = function (pitch) {
  return Utils.NOTE_POS[pitch] === 0 || !!Utils.NOTE_POS[pitch];
};
