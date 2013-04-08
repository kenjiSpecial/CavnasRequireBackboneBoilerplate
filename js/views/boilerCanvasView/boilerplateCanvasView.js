define([
    'jquery',
    'underscore',
    'backbone',
    'mout/function/bind',
    'models/canvasControlModel'
], function($, _, Backbone, bind, CanvasControlModel){
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var BoilerView = Backbone.View.extend({
        el: $("#container"),
        initialize: function(){

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas = document.createElement("canvas");
            this.$el.append(this.canvas);

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.context = this.canvas.getContext("2d");
            this.render();


        },

        update: function(){

        },

        render: function(){
            this.context.fillRect(0, 0, this.width, this.height);
            this.context.fillStyle = "#ffff00";
            this.context.fillRect( 0, 0, this.width, this.height);
        },

        loop: function(){

            this.update();

            this.render();

            if(CanvasControlModel.get("id") == 1) requestAnimFrame(bind(this.loop, this));
        },

        remove: function(){
            this.$el.addClass("transfrom");

            setTimeout(bind(this.removeCanvas, this), 450);
        },

        removeCanvas: function(){
            this.$el.removeClass("transfrom");
            this.canvas.remove();
        },
        resize: function(){
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.render();
        }

    });

    return BoilerView;
});
