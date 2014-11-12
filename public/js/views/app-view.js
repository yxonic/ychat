var app = app || {};

(function ($) {
    'use strict';
    
    var format = function(date, full) {
        var str = '';
        if (full) {
            var text = date.getFullYear() + '-'
                + (date.getMonth() + 1) + '-'
                + date.getDate() + ' ';
            str += text;
        }
        var time = date.getHours() + ':'
            + date.getMinutes() + ':'
            + date.getSeconds();
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

        initialize: function () {
            this.$input = this.$('#input');
            this.$list = $('#conversation');
            this.$client = new Faye.Client('/faye', { timeout: 20 });

            this.$client.subscribe(app.room, function (msg) {
                app.msgs.create(msg.model);
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
        },

        addOne: function (msg) {
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
                    this.$list.prepend("<li style='text-align:right'>"
                                       + datestr
                                       + "</li>").listview('refresh');
                }
                this.$list.prepend(view.render().el).listview('refresh');
            } else {
                var last = app.msgs.at(app.msgs.length - 2).attributes;
                console.log(app.msgs);
                if (msg.attributes.time - last.time > duration) {
                    var date = new Date(last.time);
                    var pdate = new Date(msg.attributes.time);
                    var datestr = '';
                    if (date.getDate() != pdate.getDate())
                        datestr += format(pdate, true);
                    else
                        datestr += format(pdate);
                    this.$list.append("<li style='text-align:right'>"
                                      + datestr
                                      + "</li>").listview('refresh');
                }
                this.$list.append(view.render().el).listview('refresh');
                var last_li = $("ul li:last-child");
                setTimeout(function () {
                    $.mobile.silentScroll(last_li.offset().top);
                }, 50);
            }
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
                this.$client.publish(app.room, {
                    model: this.newAttributes()
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
