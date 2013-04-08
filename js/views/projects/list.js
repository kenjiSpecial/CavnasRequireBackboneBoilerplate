// Filename: views/projects/list
define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above
    'models/project',
    'text!templates/projects/list.html'
], function($, _, Backbone, ProjectsModel, projectsListTemplate){
    var ProjectListView = Backbone.View.extend({
        el: $("#container"),
        initialize: function(){
            Person = Backbone.Model.extend({
                initialize: function(){
                    alert("Welcome to this world");
                }
            });

            var person = new ProjectsModel();

            var compiledTemplate = _.template( projectsListTemplate, { name: person.get('name') } );
            this.$el.html(compiledTemplate);

            this.canvas = document.createElement("canvas");
            this.$el.append(this.canvas);

            this.canvas.width = 800;
            this.canvas.height = 600;

            this.content = this.canvas.getContext("2d");
            this.content.fillRect(0, 0, 800, 600);
        }
    });
    // Returning instantiated views can be quite useful for having "state"
    return ProjectListView;
});