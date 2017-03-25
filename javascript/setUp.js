// var Controller = window.Controller || (window.Controller = {});
var Model = window.Model || (window.Model = {});
// var Utils = window.Utils || (window.Utils = {});
var View = window.View || (window.View = {});

$(function () {
  Model.setNewMelody();
  View.drawMelody(Model.melody);
});
