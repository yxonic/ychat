var app = app || {};

(function ($) {
    'use strict';

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
            console.log(msg.toJSON());
            if (msg.toJSON().history) {
                this.$list.prepend(view.render().el).listview('refresh');
            } else {
                this.$list.append(view.render().el).listview('refresh');
                var last_li = $("ul li:last-child").offset().top;
                setTimeout(function () {
                    $.mobile.silentScroll(last_li);
                }, 50);
            }
        },

        addAll: function () {
            this.$list.html('');
            app.msgs.each(this.addOne, this);
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
