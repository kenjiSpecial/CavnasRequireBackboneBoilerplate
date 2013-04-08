// Filename: views/projects/list
define([
    'jquery',
    'underscore',
    'backbone',
    'models/navModel',
    'models/canvasControlModel',
    'text!templates/nav/nav.html'

], function($, _, Backbone, navModel, CanvasControlModel, projectsListTemplate){
    var ProjectListView = Backbone.View.extend({
        el: $("#mainNav"),
        initialize: function(){
//            Compile the template using Underscores micro-templating
            var compiledTemplate = _.template( projectsListTemplate, {idName: navModel.get("idName")} );
            this.$el.html(compiledTemplate);

        },

        changeStatus: function(){

            console.log(navModel.get('id'));

            var li = $("#mainNav li a");
            li.removeClass("active");

            var $li = $("#mainNav li a").filter(function(index) {
                console.log()
                if(index==parseInt(CanvasControlModel.get('id'))){
                    return true;
                }
            });
            $li.addClass("active")



        }

    });
    // Returning instantiated views can be quite useful for having "state"
    return ProjectListView;
});