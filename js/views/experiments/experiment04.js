define([
    'jquery',
    'underscore',
    'backbone',
    'mout/function/bind',
    'models/canvasControlModel',
    'tweenLite',
    'easing'
], function ($, _, Backbone, bind, CanvasControlModel) {
    window.requestAnimFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function randomNoise(canvas, x, y, width, height, alpha) {
        x = x || 0;
        y = y || 0;
        width = width || canvas.width;
        height = height || canvas.height;
        alpha = alpha || 255;
        var g = canvas.getContext("2d"),
            imageData = g.getImageData(x, y, width, height),
            random = Math.random,
            pixels = imageData.data,
            n = pixels.length,
            i = 0;
        while (i < n) {
            pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256) | 0;
            pixels[i++] = alpha;
        }
        g.putImageData(imageData, x, y);
        return canvas;
    }

    function perlinNoiseData() {
        //noise = noise || randomNoise(createCanvas(canvas.width, canvas.height));
        var width = 32;
        var height = 24;
        var smallCanvas = document.createElement("canvas");
        smallCanvas.width = width;
        smallCanvas.height = height;

        var noise = randomNoise( smallCanvas, 0, 0, width, height, 255);

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        var g = canvas.getContext("2d");
        g.save();

        /* Scale random iterations onto the canvas to generate Perlin noise. */
        for (var size = 4; size <= noise.width; size *= 2) {
            var x = (Math.random() * (noise.width - size)) | 0,
                y = (Math.random() * (noise.height - size)) | 0;
            g.globalAlpha = 4 / size;
            g.drawImage(noise, x, y, size, size, 0, 0, canvas.width, canvas.height);
        }

        g.restore();
        var img = g.getImageData(0, 0, width, height);

        var outputData = [];
        for(var i = 0; i < img.data.length; i+=4){
            outputData.push(img.data[i]);
        }

        return outputData;
    }

    /**
     * Experiment04View
     *
     * @type {*}
     */

    var Experiment04View = Backbone.View.extend({
        el: $("#container"),
        canvas: null,
        context: null,
        initialize: function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas = document.createElement("canvas");
            this.$el.append(this.canvas);

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.context = this.canvas.getContext("2d");

            this.context.font = "5vw Arial";
            var hour = new Date().getHours() > 9 ? new Date().getHours() : "0" + new Date().getHours();
            var minute = new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes();
            var second = new Date().getSeconds() > 9 ? new Date().getSeconds() : "0" + new Date().getSeconds();
            var time = hour + ":" + minute + ":" + second ;

            this.textwidth = this.context.measureText(time).width;
            this.marginLeft = (this.width - this.textwidth)/2;

            var outputdata = perlinNoiseData();

            var width = window.innerWidth / 32;
            var height = window.innerHeight / 24;


            this.perlinValues = [];
            for(var i in outputdata){
                var perlin = {};
                perlin.value = outputdata[i];
                this.perlinValues.push(perlin);
            }



            for(var x = 0; x < 32; x++){
                for(var y = 0; y < 24; y++){
                    var colorNumber = outputdata[x + y * 32];
                    this.context.save();
                    var angle = colorNumber /255 * 2 * Math.PI;

                    this.context.translate(width * x + width/2, height * y + height/2);
                    this.context.rotate(angle);

                    this.context.strokeStyle = "#fff"; //"rgb(0, 0, 0)";
                    this.context.beginPath();
                    this.context.moveTo(-10, 0);
                    this.context.lineTo( 10, 0);
                    this.context.stroke();
                    this.context.closePath();


                    this.context.beginPath();

                    this.context.moveTo(10 + 6 * Math.cos(Math.PI * 5 / 6), 6 * Math.sin(Math.PI * 5 / 6));
                    this.context.lineTo(10, 0);
                    this.context.lineTo(10 + 6 * Math.cos(Math.PI * 7 / 6), 6 * Math.sin(Math.PI * 7 / 6));
                    this.context.stroke();

                    this.context.closePath();

                    this.context.restore();

                }
            }

            this.kaiten = true;
            setTimeout(bind(this.changeTime, this), 5000);
            this.loop();
        },

        loop: function(){

            if(this.perlinChangeStatus){
                this.context.clearRect(0, 0, this.width, this.height);
                var width = window.innerWidth / 32;
                var height = window.innerHeight / 24;

                for(var x = 0; x < 32; x++){
                    for(var y = 0; y < 24; y++){
                        var colorNumber = this.perlinValues[x + y * 32].value | 0;

                        this.context.save();
                        var angle = colorNumber /255 * 2 * Math.PI;

                        this.context.translate(width * x + width/2, height * y + height/2);
                        this.context.rotate(angle);

                        this.context.strokeStyle = "#fff";
                        this.context.beginPath();
                        this.context.moveTo(-10, 0);
                        this.context.lineTo( 10, 0);
                        this.context.stroke();
                        this.context.closePath();


                        this.context.beginPath();

                        this.context.moveTo(10 + 6 * Math.cos(Math.PI * 5 / 6), 6 * Math.sin(Math.PI * 5 / 6));
                        this.context.lineTo(10, 0);
                        this.context.lineTo(10 + 6 * Math.cos(Math.PI * 7 / 6), 6 * Math.sin(Math.PI * 7 / 6));
                        this.context.stroke();

                        this.context.closePath();

                        this.context.restore();

                    }
                }
            }

            if (CanvasControlModel.get("id") == 4) requestAnimFrame(bind(this.loop, this));
        },

        changeTime: function(){
            var outputdata = perlinNoiseData();
            this.perlinChangeStatus = true;
            //console.log("changeTime");
            for(var i in outputdata){
                if(this.kaiten){
                    TweenLite.to(this.perlinValues[i], 0.4, {value:outputdata[i] + 255});
                }else{
                    TweenLite.to(this.perlinValues[i], 0.4, {value:outputdata[i]});

                }
            }


            setTimeout(bind(this.changeStatusTimer, this), 1000);
            setTimeout(bind(this.changeTime, this), 5000);
        },

        changeStatusTimer: function(){
            this.perlinChangeStatus = false;
            this.kaiten =! this.kaiten;
        },

        remove: function () {
            this.$el.addClass("transfrom");

            setTimeout(bind(this.removeCanvas, this), 450);
        },

        removeCanvas: function () {
            this.$el.removeClass("transfrom");
            this.canvas.remove();
        }
    });
    return Experiment04View;
});