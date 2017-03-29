var View = window.View || (window.View = {});

$(function () {
  $('#new-melody').on('click', function (event) {
    // TODO: clean up these selectors
    var clef = $('#clef').val();
    var type = $('#rhythm').val();
    View.requestNewMelody(clef, type);
  });

  $('#play').on('click', function (event) {
    var metronome = $('#metronome').is(':checked');
    View.requestPlay(metronome, 4);
  });

  $('#stop').on('click', function (event) {
    View.requestStop();
  });

  $('#tempo').change(function (event) {
    View.requestSetTempo(parseInt($('#tempo')[0].value, 10));
  });

  // pressing pitch names along with up/down arrows for sharp/flats
  $(window).keypress(handleKeyPress); // most keys
  $(window).keydown(handleKeyUpDown); // only up and down arrows
  $(window).keyup(handleKeyUpDown); // only up and down arrows

  function handleKeyPress (event) {
    $('button').blur();
    if (event.charCode === 32) { // start/stop playback on spacebar
      event.preventDefault();
      View.requestTogglePlay(false, 4);
    }
    if (event.charCode === 13) { // generate new melody on carriage return
      event.preventDefault();
      View.requestStop();
      var clef = $(':radio:checked')[0].value;
      View.requestNewMelody(clef);
    }
    var letter = String.fromCharCode(event.charCode).toUpperCase();
    if (View.arrowsUpDown.upArrow) {
      letter += 's';
    } else if (View.arrowsUpDown.downArrow) {
      letter += 'b';
    }
    if (View.pressedNotes.hasOwnProperty(letter)) {
      View.pressedNotes[letter] = true;
    }
  }

  function handleKeyUpDown (event) { // functionality for sharps and flats
    // set upArrow/downArrow to true if they are being pressed and to false if they are being unpressed
    if (event.which === 38) {
      event.preventDefault();
      View.arrowsUpDown.upArrow = event.type === 'keydown';
    }
    if (event.which === 40) {
      event.preventDefault();
      View.arrowsUpDown.upArrow = event.type === 'keydown';
    }
  }
});
