// Filename: views/projects/list
define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above
    'collections/projects',
    'text!templates/projects/list.html'

], function($, _, Backbone, ProjectsCollection, projectsListTemplate){
    var ProjectListView = Backbone.View.extend({
        el: $("#container"),
        initialize: function(){
            this.collection = new ProjectsCollection();
            this.collection.add({ name: "Ginger Kid"});
            // Compile the template using Underscores micro-templating
            console.log(this.collection.models);

//            var compiledTemplate = _.template( projectsListTemplate, { projects: this.collection.models } );
//            this.$el.html(compiledTemplate);
//            this.$el.html("container");

            this.$el.html("Hello");
        }
    });
    // Returning instantiated views can be quite useful for having "state"
    return ProjectListView;
});