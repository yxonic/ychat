$(document).ready(function() {
    setTimeout(function () {
        $.mobile.changePage('#ask', 'pop', true, true);
    }, 200);
});

var user;

var textbox = $('.name');
textbox.keyup(function(e) {
    if (e.keyCode == 13) {
        $('#ok').trigger('click');
    }
});

$('#ok').click(function() {
    user = textbox.val();
    if (user.trim().length == 0) user = "Anonymous";
    setTimeout(function () {
        $('.input').focus();
    }, 300);
});
