define([
    'jquery',
    'underscore',
    'backbone',
    'mout/function/bind',
    'models/canvasControlModel'
], function ($, _, Backbone, bind, CanvasControlModel) {
    window.requestAnimFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // ------------------------------------------------------

    var Particle = function( _fl, _rad, _color, _center){

        this.rad = _rad != null ? _rad : 10;
        this.color = _color != null ? _color : "#ff0000";
        this.fl = _fl;

        this.centerPos = _center ? _center : {x: window.innerWidth / 2, y: window.innerHeight / 2};
        this.currentPos = this.pos = {x: 0, y: 0, z: 0};
        this.currentVel = this.vel = {x: 0, y: 0, z: 0};
    };

    // ------------------------------------------------------

    Particle.prototype.draw = function(context){
        this.rate = this.fl / (this.fl + this.currentPos.z);

        context.beginPath();
        context.globalCompositeOperation = 'lighter';
        var randomNumber = (3*Math.random())|0;

        switch (randomNumber){
            case 0:
                context.fillStyle = "rgba( 0, 0, 255, " + this.rate + ")";
                break;
            case 1:
                context.fillStyle = "rgba( 255, 0, 0, " + this.rate + ")";
                break;
            case 2:
                context.fillStyle = "rgba( 0, 255, 0, " + this.rate + ")";
                break;
        }

        context.arc(this.currentPos.x * this.rate + this.centerPos.x, this.currentPos.y * this.rate + this.centerPos.y, this.rad * this.rate, 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();
    };


    // ------------------------------------------------------

    Particle.prototype.update = function(dt){
//        this.currentPos.x = Math.pow((this.pos.x - this.currentPos.x), dt*10);
//        this.currentPos.y = Math.pow((this.pos.y - this.currentPos.y), dt*10);
//        this.currentPos.z = Math.pow((this.pos.z - this.currentPos.z), dt*10);

        this.currentPos.x = (this.pos.x - this.currentPos.x) * 0.9;
        this.currentPos.y = (this.pos.y - this.currentPos.y) * 0.9;
        this.currentPos.z = (this.pos.z - this.currentPos.z) * 0.9;
    };

    // ------------------------------------------------------

    Particle.prototype.setPosition = function(pos){
        this.pos = pos;
    };

    // ------------------------------------------------------

    Particle.prototype.setVelocity = function(vel){
        this.vel = vel;
    };

    // ------------------------------------------------------
    // ------------------------------------------------------


    var Shape = function (_context, _fl, _rad, _color, _centerPos) {
        this.id = 2;
        this.context = _context;

        this.sideNum = 11;

        this.particles = [];
        for(var z = 0; z < this.sideNum; z++){
            for(var y = 0; y < this.sideNum; y++){
                for(var x = 0; x < this.sideNum; x++){
                    var particle = new Particle( _fl, _rad, _color, _centerPos);
                    this.particles.push(particle);
                }
            }
        }

        this.transform();
    };

    // ------------------------------------------------------

    Shape.prototype.update = function (dt) {

        for(var i in this.particles){
            this.particles[i].update(dt);
        }
    };

    Shape.prototype.rotate = function (dt) {
        this.pos.x += dt * this.vel.x;
        this.pos.y += dt * this.vel.y;
        this.pos.z += dt * this.vel.z;

        this.rate = this.fl / (this.fl + this.pos.z);
    };

    // ------------------------------------------------------

    Shape.prototype.draw = function () {
        for(var i in this.particles){
            this.particles[i].draw(this.context);
        }
    };

    Shape.prototype.transform = function(){
        switch(this.id){
            case 0:
                this.cube(); break;
            case 1:
                this.pyramid(); break;
            case 2:
                this.sphere(); break;
        }
    };

    Shape.prototype.cube = function(){
        for (var z = 0; z < this.sideNum; z++) {
            for (var y = 0; y < this.sideNum; y++) {
                for (var x = 0; x < this.sideNum; x++) {
                    var pos = {x: 100 * x - 500, y: -500 + 100*y, z: 200 + 100 * z};
                    this.particles[x + this.sideNum * y + this.sideNum * this.sideNum * z].setPosition(pos);
                }
            }
        }
    };

    Shape.prototype.pyramid = function(){
        for (var z = 0; z < this.sideNum; z++) {
            for (var y = 0; y < this.sideNum; y++) {
                for (var x = 0; x < this.sideNum; x++) {
                    var side = 100;
                    var maxSide = side *  y / 9;
                    var pos = {x: (maxSide * (x - 5) ) * z /(this.sideNum - 1) , y: -500 + side*y, z: 200 + 10 *  z};
                    this.particles[x + this.sideNum * y + this.sideNum * this.sideNum * z].setPosition(pos);
                }
            }
        }
    };

    Shape.prototype.sphere = function(){
        for (var z = 0; z < this.sideNum; z++) {
            for (var y = 0; y < this.sideNum; y++) {
                for (var x = 0; x < this.sideNum; x++) {
                    var yPos = (y - 5) * 200;
                    var rate;

                    if(y <= 5){
                        rate = y /5;
                    }else{
                        rate = (10 - y)/5;
                    }


                    var rad = 500 * rate;
                    var xPos = (100 * x - 500)*rate;
                    var zRad = Math.sqrt(rad * rad - xPos * xPos);
                    var zPos = (-1 + 2 * z / (this.sideNum -1))* zRad;
                    var pos = {x: xPos, y: yPos, z: zPos + 500};
                    this.particles[x + this.sideNum * y + this.sideNum * this.sideNum * z].setPosition(pos);

                }
            }
        }
    };


    // ------------------------------------------------------
    // ------------------------------------------------------

    var fl = 250;

    var Experiment03View = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas = document.createElement("canvas");
            this.$el.append(this.canvas);

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.context = this.canvas.getContext("2d");


            var centerPos = {x: this.width / 2, y: this.height / 2};
            this.shape = new Shape(this.context, fl, 10, "#ffffff", centerPos);


            // variable about time
            this.lastTime = new Date().getTime();
            this.sumTime = 0;
            this.duration = 3;

            this.loop();

        },

        update: function () {
            var currentTime = new Date().getTime();
            var dt = (currentTime - this.lastTime) / 1000;
            this.shape.update(dt);
            this.sumTime += dt;
            this.lastTime = currentTime;


            if(this.sumTime > this.duration){
                this.sumTime -= this.duration;
                this.shape.id = (this.shape.id + 1) % 3;
                this.shape.transform();
            }

        },

        render: function () {
            this.context.clearRect(0, 0, this.width, this.height);
            this.shape.draw();
        },

        loop: function () {
            this.update();
            this.render();

            if (CanvasControlModel.get("id") == 3) requestAnimFrame(bind(this.loop, this));
        },

        remove: function () {
            this.$el.addClass("transfrom");

            setTimeout(bind(this.removeCanvas, this), 450);
        },

        removeCanvas: function () {
            this.$el.removeClass("transfrom");
            this.canvas.remove();
        },

        resize: function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.render();
        },

        mouseMove: function () {

        }
    });

    return Experiment03View;
});
