// Filename: views/projects/list
define([
    'jquery',
    'underscore',
    'backbone',
    'models/navModel',
    'models/canvasControlModel',
    'text!templates/date/date.html'

], function($, _, Backbone, navModel, CanvasControlModel, projectsListTemplate){
    //var dataDate = [2012, 2013, 2014, 2015]
    var dataDate = {"home": "April 08, 2013", "exp01": "April 08, 2013", "exp02": "April 08, 2013", "exp03": "April 15, 2013", "exp04": "May 14, 2013"};
    var DateView = Backbone.View.extend({
        el: $("#mainDate"),

        initialize: function(){
            this.compiledTemplate = _.template( projectsListTemplate, { DateData: "0"} );
            this.$el.html(this.compiledTemplate);
        },

        change:function(val){
            console.log(dataDate[val]);
            this.compiledTemplate = _.template( projectsListTemplate, { DateData: dataDate[val]} );
            this.$el.html(this.compiledTemplate);
        }

    });

    // Returning instantiated views can be quite useful for having "state"
    return DateView;
});