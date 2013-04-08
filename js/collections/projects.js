// Filename: collections/projects
define([
    'underscore',
    'backbone',
    // Pull in the Model module from above
    'models/project'
], function(_, Backbone, ProjectModel){
    var ProjectCollection = Backbone.Collection.extend({
        model: ProjectModel
    });
    // You don't usually return a collection instantiated
    return ProjectCollection;
});