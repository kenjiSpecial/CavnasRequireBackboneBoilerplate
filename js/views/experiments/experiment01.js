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

    var Experiment01View = Backbone.View.extend({
        el: $("#container"),
        initialize: function(){

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas = document.createElement("canvas");
            this.$el.append(this.canvas);

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.context = this.canvas.getContext("2d");

            this.widGap = 50;
            this.widNum = (this.width / this.widGap)|0;
            this.heightNum = 6;
            this.heightMax = this.height * .4;

            this.particles = [];
            this.heights = [];

            for(var j = 0; j < this.heightNum; j++){
                this.heights.push( this.heightMax - j * this.heightMax  / this.heightNum );

                for(var i = 0; i < this.widNum; i++){
                    var xPos = (i + .5) * this.widGap;
                    var yPos = this.height / 2;
                    this.particles.push({x: xPos, y: yPos});
                }
            }

            this.param = 1;
            this.delY = 1;
            this.delX = 1;

            this.lastTime = new Date().getTime();
            this.sumTime = 0;
            this.loop();

//            setTimeout(bind(this.loop, this), 450);
        },

        update: function(){
            var curTime = new Date().getTime();
            this.sumTime += (curTime -this.lastTime)/1000;
            this.lastTime = curTime;
        },

        render: function(){
            this.context.clearRect(0, 0, this.width, this.height);

            for(var j = 0; j < this.heightNum; j++){
                var maxHeight = this.heights[j] * this.delX;

                for(var i = 0; i < this.widNum; i++){
                    var pos = this.particles[i + j * this.widNum];
                    var theta = (2 * i/ this.widNum  + this.sumTime) * 2 * Math.PI;

                    this.context.beginPath();
                    this.context.fillStyle = "#fff";

                    this.context.arc(pos.x, pos.y + maxHeight *  Math.cos(theta), 2 * this.delY, 0, 2 * Math.PI, false);
                    this.context.fill();
                    this.context.closePath();
                }
            }
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
            $(this.canvas).remove();
        },
        resize: function(){
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.render();
        },
        mouseMove: function(pos){
            this.delX =  pos.x / this.width * 2 - 1;
            this.delY = pos.y / this.height   + .5;
        }

    });

    return Experiment01View;
});
