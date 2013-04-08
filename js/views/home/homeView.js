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

    var HomeView = Backbone.View.extend({
        el: $("#container"),
        canvas: null,
        initialize: function(){

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas = document.createElement("canvas");
            this.$el.append(this.canvas);

            this.canvas.width = this.width;
            this.canvas.height = this.height;



            this.context = this.canvas.getContext("2d");




            this.font = 'bold 12vw Arial';
            this.context.font = this.font;




            this.text = "BOILERPLATE";
            this.textWidth = (this.context.measureText(this.text)).width;

            this.curNum = 0;
            this.maxNumber = this.text.length;
            this.interval = 0.03;
            this.currentTime;
            this.sumTIme = 0;

            this.doneStatus = false;



            this.channel = 0; // 0 = red, 1 = green, 2 = blue
            this.compOp = 'lighter'; // CompositeOperation = lighter || darker || xor

            this.phase = 0.0;
            this.phaseStep = 0.05; //determines how often we will change channel and amplitude
            this.amplitude = 0.0;
            this.amplitudeBase  = 2.0;
            this.amplitudeRange = 2.0;
            this.alphaMin = 0.8;

            this.glitchAmplitude = 20.0;
            this.glitchThreshold = 0.9;
            this.scanlineBase = 40;
            this.scanlineRange = 40;
            this.scanlineShift = 15;

            this.context.font = this.font;
            this.context.fillStyle = "rgb(255,255,255)";
            var x1 = this.width - this.textWidth >> 1;
            this.context.fillText(" |", x1, this.height/2);


            setTimeout(bind(this.start, this), 800);

        },

        start:function(){
            this.lastTime = new Date().getTime();

            this.loop();
        },

        update: function(){

            if(this.doneStatus){

                this.phase += this.phaseStep;

                if( this.phase > 1 ) {
                    this.phase     = 0.0;
                    this.channel   = (this.channel === 2) ? 0 : this.channel + 1;
                    this.amplitude = this.amplitudeBase + (this.amplitudeRange * Math.random());
                }
            }else{


                if(this.curNum > this.maxNumber){
                    this.doneStatus = true;

                } else{
                    this.currentTime = new Date().getTime();
                    this.sumTIme += (this.currentTime - this.lastTime)/1000;
                    this.lastTime = this.currentTime;

                    if(this.sumTIme > this.interval) {
                        this.sumTIme -= this.interval;
                        this.curNum += 1;
                    }
                }

            }
        },

        render: function(){


            if(this.doneStatus){
                var x0 = this.amplitude * Math.sin( (Math.PI * 2) * this.phase ) >> 0,
                    x1, x2, x3;

                if( Math.random() >= this.glitchThreshold ) {
                    x0 *= this.glitchAmplitude;
                }

                x1 = this.width - this.textWidth >> 1;
                x2 = x1 + x0;
                x3 = x1 - x0;

                this.context.clearRect( 0, 0, this.width, this.height );
                this.context.globalAlpha = this.alphaMin + ((1-this.alphaMin) * Math.random());

                switch( this.channel ) {
                    case 0: this.renderChannels(x1, x2, x3); break;
                    case 1: this.renderChannels(x2, x3, x1); break;
                    case 2: this.renderChannels(x3, x1, x2); break;
                }

                this.renderScanline();
            }else{
                this.context.clearRect( 0, 0, this.width, this.height );

                var text = this.text.slice(0, this.curNum) + "|";

                this.context.font = this.font;
                this.context.fillStyle = "rgb(255,255,255)";
                var x1 = this.width - this.textWidth >> 1;
                this.context.fillText(text, x1, this.height/2);
            }
        },

        renderChannels: function (x1, x2, x3) {
            this.context.font = this.font;
            this.context.fillStyle = "rgb(255,0,0)";
            this.context.fillText(this.text, x1, this.height/2);

            this.context.globalCompositeOperation = this.compOp;

            this.context.fillStyle = "rgb(0,255,0)";
            this.context.fillText(this.text, x2, this.height/2);
            this.context.fillStyle = "rgb(0,0,255)";
            this.context.fillText(this.text, x3, this.height/2);
        },

        renderScanline: function () {
            var y = this.height * Math.random() >> 0,
                o = this.context.getImageData( 0, y, this.width, 1 ),
                d = o.data,
                i = d.length,
                s = this.scanlineBase + this.scanlineRange * Math.random() >> 0,
                x = -this.scanlineShift + this.scanlineShift * 2 * Math.random() >> 0;

            while( i-- > 0 ) {
                d[i] += s;
            }

            this.context.putImageData( o, x, y );
        },

        loop: function(){
            console.log("Home Loop");

            this.update();

            this.render();

            if(CanvasControlModel.get("id") == 0) requestAnimFrame(bind(this.loop, this));
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
            console.log("home View resize");

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
        },

        mouseMove: function(pos){

        }

    });

    return HomeView;
});