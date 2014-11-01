var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

app.user = 'Anonymous';
    
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

app.uid = guid();

$(function () {
    'use strict';
    
    $(document).ready(function() {
        setTimeout(function () {
            $.mobile.changePage('#ask', 'pop', true, true);
        }, 200);
    });
    
    var textbox = $('.name');
    textbox.keyup(function(e) {
        if (e.keyCode == 13) {
            $('#ok').trigger('click');
        }
    });
    
    $('#ok').click(function() {
        if (textbox.val().length > 0)
            app.user = textbox.val();
        app.time = new Date().getTime();
        new app.AppView();
    });
});

