var app = app || {};

(function ($) {
    'use strict';
    app.MsgView = Backbone.View.extend({
        template: _.template($('#item-template').html()),
        render: function() {
            this.el = this.template(this.model.attributes);
            return this;
        }
    });
})(jQuery);
