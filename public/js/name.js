$(document).ready(function() {
    setTimeout(function () {
        $.mobile.changePage('#ask', 'pop', true, true);
    }, 200);
    setTimeout(function () {
        $('.name').focus();
    }, 300);
});

var user;

var textbox = $('.name');
textbox.keyup(function(e) {
    if (e.keyCode == 13 && textbox.val().length != 0) {
        $('#ok').trigger('click');
    }
});

$('#ok').click(function() {
    user = textbox.val();
    if (user.length == 0) name = "Anonymous";
    setTimeout(function () {
        $('.input').focus();
    }, 300);

});
