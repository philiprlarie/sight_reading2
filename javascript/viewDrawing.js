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
    drawMeasure(measures[i], i, melody.clef);
  }
  ties.forEach(function (t) {
    t.setContext(context).draw();
  });
};

function splitIntoMeasures (melody) {
  // doesn't handle notes so long that they span into three measures
  var measures = [];
  var ties = [];
  var clef = melody.clef === 'bass' ? 'bass' : 'treble';

  for (var i = 0; i < melody.notes.length; i++) {
    var note = melody.notes[i];
    // first note in measure
    if (note.timing % 4 === 0) {
      measures.push([]);
    }

    var measureNumberOfStartOfNote = Math.floor(note.timing / 4);
    var measureNumberOfEndOfNote = (note.timing + note.dur) % 4 === 0 ? (note.timing + note.dur) / 4 - 1 : Math.floor((note.timing + note.dur) / 4);

    var isRest = note.pitch === 'rest';
    if (measureNumberOfStartOfNote === measureNumberOfEndOfNote) {
      // note is fully contained in one measure
      var vfNote = new VF.StaveNote({
        clef: clef,
        keys: [vfPitch(note.pitch, clef)],
        duration: vfDuration(note.dur, isRest)
      });
      colorNote(note, vfNote);
      measures[measures.length - 1].push(vfNote);
    } else {
      // last note in measure carries over into next measure
      var beforeBarLength = 4 - note.timing % 4;
      var afterBarLength = (note.timing + note.dur) % 4;
      var firstVfNote = new VF.StaveNote({
        clef: clef,
        keys: [vfPitch(note.pitch, clef)],
        duration: vfDuration(beforeBarLength, isRest)
      });
      var secondVfNote = new VF.StaveNote({
        clef: clef,
        keys: [vfPitch(note.pitch, clef)],
        duration: vfDuration(afterBarLength, isRest)
      });
      colorNote(note, firstVfNote);
      colorNote(note, secondVfNote);

      measures[measures.length - 1].push(firstVfNote);
      measures.push([]);
      measures[measures.length - 1].push(secondVfNote);

      if (!isRest) {
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
  }
  return [measures, ties];
}

function vfDuration (duration, isRest) {
  var vfDurationMap = {
    1: 'q',
    0.5: '8'
  };
  return isRest ? vfDurationMap[duration] + 'r' : vfDurationMap[duration];
}

function vfPitch (pitch, clef) {
  if (pitch === 'rest') {
    return clef === 'bass' ? 'D/3' : 'B/4';
  }
  return pitch.slice(0, -1).replace(/s/, '#') + '/' + pitch.slice(-1);
}

function colorNote (note, vfNote) {
  if (note.isPlayedCorrectly === true) {
    vfNote.setStyle({ shadowColor: 'green', shadowBlur: 100 });
  } else if (note.isPlayedCorrectly === false) {
    vfNote.setStyle({ shadowColor: 'red', shadowBlur: 100 });
  }
}

function drawMeasure (measure, measureNumber, clef) {
  var stave = new VF.Stave(10 + measureNumber * 200, 40, 200);
  if (measureNumber === 0) {
    if (clef === 'bass') {
      stave.addClef('bass').addTimeSignature('4/4');
    } else {
      stave.addClef('treble').addTimeSignature('4/4');
    }
  }
  stave.setContext(context).draw();
  var beams = VF.Beam.generateBeams(measure);
  VF.Formatter.FormatAndDraw(context, stave, measure);
  beams.forEach(function (b) {
    b.setContext(context).draw();
  });
}
