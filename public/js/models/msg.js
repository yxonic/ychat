var app = app || {};

(function () {
    'use strict';
    app.Msg = Backbone.Model.extend({
        defaults: {
            room: 'public',
            uid: '',
            time: new Date().getTime(),
            name: 'Anonymous',
            text: '',
            success: false
        },
        ack: function () {
            this.save({
                success: true
            });
        }
    });
})();
