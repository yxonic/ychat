var app = app || {};

(function () {
    'use strict';

    var Msgs = Backbone.Collection.extend({
        model: app.Msg,
        localStorage: new Backbone.LocalStorage('msgs-backbone'),
        comparator: 'time'
    });

    app.msgs = new Msgs();
})();
