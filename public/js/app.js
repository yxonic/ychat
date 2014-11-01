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
        if (!localStorage.getItem('user')) {
            $.mobile.changePage('#ask', 'pop', true, true);
        } else {
            app.user = localStorage.getItem('user');
            app.uid = localStorage.getItem('uid');
            app.time = new Date().getTime();
            new app.AppView();
        }
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
        localStorage.setItem('user', app.user);
        localStorage.setItem('uid', app.uid);
        app.time = new Date().getTime();
        new app.AppView();
    });
});

