var View = window.View || (window.View = {});
// var Utils = window.Utils || (window.Utils = {});

var Drawing = View.Drawing = {};

// Make sure vexflow-debug.js is loaded first
var VF = window.Vex.Flow;
var renderer;
var context;

// set the canvas when page loaded
$(function () {
  var svgHolder = document.getElementById('svg-holder');
  renderer = new VF.Renderer(svgHolder, VF.Renderer.Backends.SVG);

  renderer.resize(900, 300);
  context = renderer.getContext();
  context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');
});

Drawing.drawMelody = function (melody) {
  renderer.ctx.clear();
  var splitIntoMeasuresResults = splitIntoMeasures(melody);
  var measures = splitIntoMeasuresResults[0];
  var ties = splitIntoMeasuresResults[1];
  for (var i = 0; i < measures.length; i++) {
    drawMeasure(measures[i], i);
  }
  if (ties) {
    ties.forEach(function (t) {
      t.setContext(context).draw();
    });
  }
};

function splitIntoMeasures (melody) {
  // doesn't handle notes so long that they span into three measures
  var measures = [];
  var ties = [];

  // i = 4 to start so we can skip countOff
  for (var i = 4; i < melody.notes.length; i++) {
    var note = melody.notes[i];
    // first note in measure
    if (note.timing % 4 === 0) {
      measures.push([]);
    }
    // last note in measure that carries over into next measure
    var measureNumberOfStartOfNote = Math.floor(note.timing / 4);
    var measureNumberOfEndOfNote = (note.timing + note.dur) % 4 === 0 ? (note.timing + note.dur) / 4 - 1 : Math.floor((note.timing + note.dur) / 4);

    if (measureNumberOfStartOfNote === measureNumberOfEndOfNote) {
      var vfNote = new VF.StaveNote({
        clef: 'treble',
        keys: [vfPitch(note.pitch)],
        duration: vfDuration(note.dur)
      });
      colorNote(note, vfNote);
      measures[measures.length - 1].push(vfNote);
    } else {
      var beforeBarLength = 4 - note.timing % 4;
      var afterBarLength = (note.timing + note.dur) % 4;
      var firstVfNote = new VF.StaveNote({
        clef: 'treble',
        keys: [vfPitch(note.pitch)],
        duration: vfDuration(beforeBarLength)
      });
      var secondVfNote = new VF.StaveNote({
        clef: 'treble',
        keys: [vfPitch(note.pitch)],
        duration: vfDuration(afterBarLength)
      });
      colorNote(note, firstVfNote);
      colorNote(note, secondVfNote);

      measures[measures.length - 1].push(firstVfNote);
      measures.push([]);
      measures[measures.length - 1].push(secondVfNote);

      ties.push(
        new VF.StaveTie({
          first_note: firstVfNote,
          last_note: secondVfNote,
          first_indices: [0],
          last_indices: [0]
        })
      );
    }
  }
  return [measures, ties];
}

function vfDuration (duration) {
  var vfDurationMap = {
    1: 'q',
    0.5: '8'
  };
  return vfDurationMap[duration];
}

function vfPitch (pitch) {
  return pitch.slice(0, -1) + '/' + pitch.slice(-1);
}

function colorNote (note, vfNote) {
  if (note.isPlayedCorrectly === true) {
    vfNote.setStyle({ shadowColor: 'green', shadowBlur: 100 });
  } else if (note.isPlayedCorrectly === false) {
    vfNote.setStyle({ shadowColor: 'red', shadowBlur: 100 });
  }
}

function drawMeasure (measure, measureNumber) {
  var stave = new VF.Stave(10 + measureNumber * 200, 40, 200);
  if (measureNumber === 0) {
    stave.addClef('treble').addTimeSignature('4/4');
  }
  stave.setContext(context).draw();
  var beams = VF.Beam.generateBeams(measure);
  VF.Formatter.FormatAndDraw(context, stave, measure);
  beams.forEach(function (b) {
    b.setContext(context).draw();
  });
}

// var View = window.View || (window.View = {});
// var Utils = window.Utils || (window.Utils = {});
//
// var Drawing = View.Drawing = {};
//
// var canvas;
// var context;
// // set the canvas when page loaded
// $(function () {
//   canvas = $('#canvas')[0];
//   context = canvas.getContext('2d');
// });
// var LINE_SPACING = 15; // pixels
// var SIG_SPACE = 100; // pixels. this is space for key sig, time sig, clefs
// var SPACE_AFTER_MEASURE_BAR = 20; // pixels. the first note that appears after a measure bar will be SPACE_AFTER_MEASURE_BAR pixels after that bar
//
//
//
// Drawing.drawMelody = function (melody) {
//   // draw melody -> draw each note -> draw ledger lines
//   context.clearRect(0, 0, canvas.width, canvas.height);
//   drawStaff();
//   melody.notes.forEach(Drawing.drawNote);
//   drawMeasureBars(melody);
// };
//
// Drawing.drawNote = function (note) {
//   if (!Utils.validPitch(note.pitch)) {
//     return;
//   }
//   context.textAlign = 'center';
//   context.font = (4 * LINE_SPACING) + 'px Ariel';
//   var xPos = SIG_SPACE + (canvas.width - SIG_SPACE) * (note.timing - 4 + 1 / 2) / 16; // -4 to account for the countOff. +1/2 to offset from measure bars
//   var yPos = canvas.height / 2 - Utils.NOTE_POS[note.pitch] * LINE_SPACING / 2 + 0.245 * LINE_SPACING;
//   switch (note.isPlayedCorrectly) {
//     case true:
//       context.fillStyle = 'green';
//       break;
//     case false:
//       context.fillStyle = 'red';
//       break;
//     default:
//       context.fillStyle = 'black';
//   }
//   drawLedgerLines(note, xPos);
//   context.fillText('\u2669', xPos, yPos);
//   context.fillStyle = 'black';
// };
//
// function drawStaff () {
//   context.beginPath();
//   var i;
//   // lines and spaces
//   for (i = -5; i <= 5; i++) {
//     if (i === 0) {
//       continue;
//     }
//     context.moveTo(0, canvas.height / 2 + LINE_SPACING * i);
//     context.lineTo(canvas.width, canvas.height / 2 + LINE_SPACING * i);
//   }
//   context.stroke();
//   // treble clef
//   context.fillStyle = 'black';
//   context.textAlign = 'center';
//   context.font = (10 * LINE_SPACING) + 'px Ariel';
//   context.fillText('\uD834\uDD1E', 2 * LINE_SPACING, canvas.height / 2);
//   // base clef
//   context.font = (5 * LINE_SPACING) + 'px Ariel';
//   context.fillText('\uD834\uDD22', 2 * LINE_SPACING, canvas.height / 2 + 4.25 * LINE_SPACING);
// }
//
// function drawMeasureBars (melody) {
//   context.beginPath();
//   context.moveTo(0, canvas.height / 2 + LINE_SPACING * 5);
//   context.lineTo(0, canvas.height / 2 - LINE_SPACING * 5);
//   for (var i = 1; i <= 4; i++) {
//     var xPos = SIG_SPACE + (canvas.width - SIG_SPACE) * i / 4;
//     context.moveTo(xPos, canvas.height / 2 + LINE_SPACING * 5);
//     context.lineTo(xPos, canvas.height / 2 - LINE_SPACING * 5);
//   }
//   context.stroke();
// }
//
// function drawLedgerLines (note, xPos) {
//   context.beginPath();
//   var notePos = Utils.NOTE_POS[note.pitch];
//   var xStart = xPos - LINE_SPACING * 1.2;
//   var xStop = xPos + LINE_SPACING * 0.8;
//   var i;
//   // middle C
//   if (notePos === 0) {
//     context.moveTo(xStart, canvas.height / 2);
//     context.lineTo(xStop, canvas.height / 2);
//   }
//   // notes above the staff
//   if (notePos > 11) {
//     for (i = 12; i <= notePos; i++) {
//       if ((i % 2) !== 0) {
//         continue;
//       }
//       context.moveTo(xStart, canvas.height / 2 - LINE_SPACING * i / 2);
//       context.lineTo(xStop, canvas.height / 2 - LINE_SPACING * i / 2);
//     }
//   }
//   // notes below the staff
//   if (notePos < -11) {
//     for (i = -12; i >= notePos; i--) { // jshint ignore:line
//       if ((i % 2) !== 0) {
//         continue;
//       }
//       context.moveTo(xStart, canvas.height / 2 - LINE_SPACING * i / 2);
//       context.lineTo(xStop, canvas.height / 2 - LINE_SPACING * i / 2);
//     }
//   }
//   context.stroke();
// }
