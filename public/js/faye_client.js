var client = new Faye.Client('/faye', { timeout: 20 });

client.subscribe(channel, function(msg) {
    $('.conversation').append('<li><code>' + msg.user + 
                              '</code> ' + msg.text + '</li>')
        .listview('refresh');
    var last_li = $("ul li:last-child").offset().top;
    $.mobile.silentScroll(last_li);
});

var box = $('.input');
box.keyup(function(e) {
    if (e.keyCode == 13) {
        if (box.val().length == 0) {
            box.val('');
            return;
        }
        client.publish(channel, { 
                user: user,
                text: box.val()
            });
        box.val('');
    }
});
