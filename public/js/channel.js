$(document).one('pageshow', function(event) {
    setTimeout(function () {
        $('.channel').focus();
    }, 300);
});

var textbox = $('.channel');

textbox.keyup(function(e) {
    if (e.keyCode == 13 && textbox.val().length != 0) {
        $('#ok').trigger('click');
    }
});

$('#ok').click(function() {
    var channel = textbox.val();
    if (channel.length == 0)
        channel = "lobby";
    window.location.href = channel;
});
