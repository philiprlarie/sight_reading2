/* eslint-disable */
$(function () {

  VF = Vex.Flow;

  // Create an SVG renderer and attach it to the DIV element named "boo".
  var div = document.getElementById("hahahoho")
  var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

  // Configure the rendering context.
  renderer.resize(900, 900);
  var context = renderer.getContext();
  context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");






  // Create a stave of width 400 at position 10, 40 on the canvas.
  var stave = new VF.Stave(10, 40, 300);

  // Add a clef and time signature.
  stave.addClef("treble").addTimeSignature("4/4");

  // Connect it to the rendering context and draw!
  stave.setContext(context).draw();




  var notes = [
      new VF.StaveNote({clef: "treble", keys: ["E##/5"], duration: "8d" }).
        addAccidental(0, new VF.Accidental("##")).addDotToAll(),

      new VF.StaveNote({clef: "treble", keys: ["Eb/5"], duration: "16" }).
        addAccidental(0, new VF.Accidental("b")),

      new VF.StaveNote({clef: "treble", keys: ["E/5", "Eb/4"], duration: "h" }).
          addDot(0),

      new VF.StaveNote({clef: "treble", keys: ["C/5", "Eb/5", "G#/5"], duration: "q" }).
        addAccidental(1, new VF.Accidental("b")).
        addAccidental(2, new VF.Accidental("#")).addDotToAll()
    ];

    var beams = VF.Beam.generateBeams(notes);
  VF.Formatter.FormatAndDraw(context, stave, notes);
  beams.forEach(function(b) {b.setContext(context).draw()})










  // Create a stave of width 400 at position 10, 40 on the canvas.
  var stave = new VF.Stave(310, 40, 300);

  // Connect it to the rendering context and draw!
  stave.setContext(context).draw();




  var notes2 = [
      new VF.StaveNote({clef: "treble", keys: ["e##/5"], duration: "8d" }).
        addAccidental(0, new VF.Accidental("##")).addDotToAll(),

      new VF.StaveNote({clef: "treble", keys: ["eb/5"], duration: "16" }).
        addAccidental(0, new VF.Accidental("b")),

      new VF.StaveNote({clef: "treble", keys: ["d/5", "eb/4"], duration: "h" }).
          addDot(0),

      new VF.StaveNote({clef: "treble", keys: ["c/5", "eb/5", "g#/5"], duration: "q" }).
        addAccidental(1, new VF.Accidental("b")).
        addAccidental(2, new VF.Accidental("#")).addDotToAll()
    ];

    notes2[0].setStyle({fillStyle: "red", shadowColor: "red", shadowBlur: 100})//, shadowColor: "yellow", shadowBlur: 3});
    notes2[1].setStyle({fillStyle: "green", shadowColor: "green", shadowBlur: 100})//, shadowColor: "yellow", shadowBlur: 3});
    notes2[2].setStyle({fillStyle: "red", shadowColor: "red", shadowBlur: 100})//, shadowColor: "yellow", shadowBlur: 3});
    notes2[3].setStyle({fillStyle: "green", shadowColor: "green", shadowBlur: 100})//, shadowColor: "yellow", shadowBlur: 3});

    var beams = VF.Beam.generateBeams(notes2);
  VF.Formatter.FormatAndDraw(context, stave, notes2);
  beams.forEach(function(b) {b.setContext(context).draw()})


  var ties = [
    new VF.StaveTie({
      first_note: notes[3],
      last_note: notes2[0],
      first_indices: [1],
      last_indices: [0]
    })

  ];
  ties.forEach(function(t) {t.setContext(context).draw()})





});
