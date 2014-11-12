var app = app || {};

(function ($) {
    'use strict';
    
    var format = function(date, full) {
        var str = '';
        var Y = date.getFullYear();
        var M = date.getMonth() + 1;
        if (M < 10)
            M = '0' + M;
        var D = date.getDate();
        if (D < 10)
            D = '0' + D;
        var h = date.getHours();
        if (h < 10)
            h = '0' + h;
        var m = date.getMinutes();
        if (m < 10)
            m = '0' + m;
        var s = date.getSeconds();
        if (s < 10)
            s = '0' + s;
        if (full) {
            var text = Y + '-' + M + '-' + D + ' ';
            str += text;
        }
        var time = h + ':' + m + ':' + s;
        str += time;
        return str;
    }
    var duration = 180000;
   
    app.AppView = Backbone.View.extend({

        el: '#main',

        events: {
            'keydown #input': 'createOnEnter',
            'click #header': 'fetchMore'
        },

        template: _.template($('#date-template').html()),

        initialize: function () {
            this.$input = this.$('#input');
            this.$list = $('#conversation');
            this.$client = new Faye.Client('/faye', { timeout: 20 });

            this.$client.subscribe(app.room, function (msg) {
                app.msgs.set(msg.model, {remove: false});
                app.msgs.reset();
            });

            this.$client.subscribe('/' + app.uid, function (msg) {
                msg.msgs.forEach(function(msg) {
                    msg.history = true;
                    app.mark = app.time;
                    app.time = msg.time;
                    app.msgs.create(msg);
                });
            });

            this.$client.publish('/faye/commands', {
                uid: app.uid,
                room: app.room,
                time: app.time,
                limit: 10
            });

            this.listenTo(app.msgs, 'add', this.addOne);
            this.listenTo(app.msgs, 'reset', this.update);
        },

        addOne: function (msg) {
            console.log(msg);
            var view = new app.MsgView({ model: msg });
            if (msg.toJSON().history) {
                var first = app.msgs.at(1);
                if (!first) first = msg.attributes;
                else first = first.attributes;
                if (first.time - msg.attributes.time > duration) {
                    var date = new Date(app.mark);
                    var pdate = new Date(msg.attributes.time);
                    var datestr = '';
                    if (date.getDate() != (new Date()).getDate())
                        datestr += format(date, true);
                    else
                        datestr += format(date);
                    this.$list.prepend(this.template({
                        datestr: datestr
                    }));
                }
                this.$list.prepend(view.render().el).listview('refresh');
            } else {
                var last = app.msgs.at(app.msgs.length - 2);
                if (last)
                    last = last.attributes;
                else
                    last = msg.attributes;
                if (msg.attributes.time - last.time > duration) {
                    var date = new Date(last.time);
                    var pdate = new Date(msg.attributes.time);
                    var datestr = '';
                    if (date.getDate() != pdate.getDate())
                        datestr += format(pdate, true);
                    else
                        datestr += format(pdate);
                    this.$list.append(this.template({
                        datestr: datestr
                    }));
                }
                this.$list.append(view.render().el).listview('refresh');
                var last_li = $("ul li:last-child");
                setTimeout(function () {
                    $.mobile.silentScroll(last_li.offset().top);
                }, 50);
            }
        },

        update: function() {
            console.log("GREAT!");
        },
        
        newAttributes: function () {
            return {
                room: app.room,
                uid: app.uid,
                time: new Date().getTime(),
                name: app.user,
                text: this.$input.val().trim(),
                success: false
            };
        },

        createOnEnter: function (e) {
            if (e.which === ENTER_KEY && !e.shiftKey) {
                e.preventDefault();
                if (this.$input.val().trim().length == 0) {
                    this.$input.val('');
                    return;
                }
                var msg = this.newAttributes();
                msg = app.msgs.create(msg);
                this.$client.publish(app.room, {
                    model: msg
                });
                this.$input.val('');
            }
        },

        fetchMore: function () {
            this.$client.publish('/faye/commands', {
                uid: app.uid,
                room: app.room,
                time: app.time
            });
        }
    });
})(jQuery);
