define([
    'jQuery',
    'Underscore',
    'Backbone',
    "mout/function/bind"
], function($, _, Backbone, bind){
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();


    return {};
});
