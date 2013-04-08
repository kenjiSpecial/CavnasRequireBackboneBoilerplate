// Filename: models/project
define([
    'underscore',
    'backbone'
], function(_, Backbone){
    var CanvasControlModel = Backbone.Model.extend({
        initialize: function(){
            console.log("Welcome to ProjectModel");
        }
    });

    var canvasControlModel = new CanvasControlModel();
    // Return the model for the module
    return canvasControlModel;
});