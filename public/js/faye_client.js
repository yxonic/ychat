var client = new Faye.Client('/faye', { timeout: 20 });

client.subscribe(channel, function(msg) {
    $('.conversation').append('<li><code>' + msg.user + 
                              '</code> ' + msg.text + '</li>')
        .listview('refresh');
    var last_li = $("ul li:last-child").offset().top;
    setTimeout(function () {
        $.mobile.silentScroll(last_li);
    }, 50);
});

var box = $('.input');
box.keydown(function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        if (box.val().trim().length == 0) {
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
