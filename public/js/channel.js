var textbox = $('.channel');

textbox.keyup(function(e) {
    if (e.keyCode == 13 && textbox.val().length != 0) {
        $('#ok').trigger('click');
    }
});

$('#ok').click(function() {
    var channel = textbox.val();
    if (channel.length == 0)
        channel = "public";
    window.location.href = channel;
});
