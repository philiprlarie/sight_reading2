var View = window.View || (window.View = {});
var Utils = window.Utils || (window.Utils = {});

var Drawing = View.Drawing = {};

var canvas;
var context;
// set the canvas when page loaded
$(function () {
  canvas = $('#canvas')[0];
  context = canvas.getContext('2d');
});
var LINE_SPACING = 15; // pixels
var SIG_SPACE = 100; // pixels. this is space for key sig, time sig, clefs

Drawing.drawMelody = function (melody) {
  // draw melody -> draw each note -> draw ledger lines
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawStaff();
  melody.notes.forEach(Drawing.drawNote);
  drawMeasureBars(melody);
};

Drawing.drawNote = function (note) {
  if (!Utils.validPitch(note.pitch)) {
    return;
  }
  context.textAlign = 'center';
  context.font = (4 * LINE_SPACING) + 'px Ariel';
  var xPos = SIG_SPACE + (canvas.width - SIG_SPACE) * (note.timing - 4 + 1 / 2) / 16; // -4 to account for the countOff. +1/2 to offset from measure bars
  var yPos = canvas.height / 2 - Utils.NOTE_POS[note.pitch] * LINE_SPACING / 2 + 0.245 * LINE_SPACING;
  switch (note.isPlayedCorrectly) {
    case true:
      context.fillStyle = 'green';
      break;
    case false:
      context.fillStyle = 'red';
      break;
    default:
      context.fillStyle = 'black';
  }
  drawLedgerLines(note, xPos);
  context.fillText('\u2669', xPos, yPos);
  context.fillStyle = 'black';
};

function drawStaff () {
  context.beginPath();
  var i;
  // lines and spaces
  for (i = -5; i <= 5; i++) {
    if (i === 0) {
      continue;
    }
    context.moveTo(0, canvas.height / 2 + LINE_SPACING * i);
    context.lineTo(canvas.width, canvas.height / 2 + LINE_SPACING * i);
  }
  context.stroke();
  // treble clef
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.font = (10 * LINE_SPACING) + 'px Ariel';
  context.fillText('\uD834\uDD1E', 2 * LINE_SPACING, canvas.height / 2);
  // base clef
  context.font = (5 * LINE_SPACING) + 'px Ariel';
  context.fillText('\uD834\uDD22', 2 * LINE_SPACING, canvas.height / 2 + 4.25 * LINE_SPACING);
}

function drawMeasureBars (melody) {
  context.beginPath();
  context.moveTo(0, canvas.height / 2 + LINE_SPACING * 5);
  context.lineTo(0, canvas.height / 2 - LINE_SPACING * 5);
  for (var i = 1; i <= 4; i++) { // jshint ignore:line
    var xPos = SIG_SPACE + (canvas.width - SIG_SPACE) * i / 4;
    context.moveTo(xPos, canvas.height / 2 + LINE_SPACING * 5);
    context.lineTo(xPos, canvas.height / 2 - LINE_SPACING * 5);
  }
  context.stroke();
}

function drawLedgerLines (note, xPos) {
  context.beginPath();
  var notePos = Utils.NOTE_POS[note.pitch];
  var xStart = xPos - LINE_SPACING * 1.2;
  var xStop = xPos + LINE_SPACING * 0.8;
  var i;
  // middle C
  if (notePos === 0) {
    context.moveTo(xStart, canvas.height / 2);
    context.lineTo(xStop, canvas.height / 2);
  }
  // notes above the staff
  if (notePos > 11) {
    for (i = 12; i <= notePos; i++) {
      if ((i % 2) !== 0) {
        continue;
      }
      context.moveTo(xStart, canvas.height / 2 - LINE_SPACING * i / 2);
      context.lineTo(xStop, canvas.height / 2 - LINE_SPACING * i / 2);
    }
  }
  // notes below the staff
  if (notePos < -11) {
    for (i = -12; i >= notePos; i--) { // jshint ignore:line
      if ((i % 2) !== 0) {
        continue;
      }
      context.moveTo(xStart, canvas.height / 2 - LINE_SPACING * i / 2);
      context.lineTo(xStop, canvas.height / 2 - LINE_SPACING * i / 2);
    }
  }
  context.stroke();
}
