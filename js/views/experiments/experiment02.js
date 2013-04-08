define([
    'jquery',
    'underscore',
    'backbone',
    "mout/function/bind",
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

    function range(a, b) {
        return (b - a) * Math.random() + a;
    };


    var Confetti = (function() {

        function Confetti(context) {
            console.log('cofetti');
            this.context = context;



            this.rgb = "rgba( 255, 255, 255";
            this.r = ~~range(2, 6);
            this.r2 = 2 * this.r;

            this.xpos = 0.5;

            this.replace();

        }

        Confetti.prototype.replace = function() {
            var w = window.innerWidth;
            var h = window.innerHeight;

            this.opacity = 0;
            this.dop = 0.03 * range(1, 4);
            this.x = range(-this.r2, w - this.r2);
            this.y = range(-20, h - this.r2);
            this.xmax = w - this.r;
            this.ymax = h - this.r;
            this.vx = range(0, 2) + 8 * this.xpos - 5;
            this.vy = 0.7 * this.r + range(-1, 1);

        };

        Confetti.prototype.draw = function() {
            var _ref;

            this.x += this.vx;
            this.y += this.vy;
            this.opacity += this.dop;
            if (this.opacity > 1) {
                this.opacity = 1;
                this.dop *= -1;
            }
            if (this.opacity < 0 || this.y > this.ymax) {
                this.replace();
            }
            if (!((0 < (_ref = this.x) && _ref < this.xmax))) {
                this.x = (this.x + this.xmax) % this.xmax;
            }

            var colorStyle = this.rgb + "," + this.opacity + ")";

            this.context.beginPath();
            this.context.fillStyle = colorStyle;
            this.context.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
            this.context.fill();
            this.context.closePath();

        };

        return Confetti;

    })();

    var Experiment02View = Backbone.View.extend({
        el: $("#container"),
        initialize: function(){

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas = document.createElement("canvas");
            this.$el.append(this.canvas);

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.context = this.canvas.getContext("2d");

            this.NUM_CONFETTI = 120;
            this.confetti = [];

            for(var i = 0; i < this.NUM_CONFETTI; i++){
                this.confetti.push(new Confetti(this.context));
            }

            this.loop();


        },

        update: function(){

        },

        render: function(){
            console.log('render');
            this.context.clearRect(0, 0, this.width, this.height);

            for(var i = 0; i < this.NUM_CONFETTI; i++){
                this.confetti[i].draw();
            }



            },

        loop: function(){

            this.update();

            this.render();

            if(CanvasControlModel.get("id") == 2)  requestAnimFrame(bind(this.loop, this));
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
        },

        mouseMove: function(pos){

        }


    });

    return Experiment02View;
});
