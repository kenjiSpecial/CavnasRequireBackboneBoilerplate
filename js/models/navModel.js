
define([
    'underscore',
    'backbone'
], function(_, Backbone){
    var NavModel = Backbone.Model.extend({
        defaults: {
            idName: 'home'
        }
    });

    var navModel = new NavModel();

    return navModel;
});