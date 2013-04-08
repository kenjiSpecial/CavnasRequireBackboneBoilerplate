// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/home/homeView',
    'views/experiments/experiment01',
    'views/experiments/experiment02',
    'views/nav/nav',
    'models/canvasControlModel'
], function($, _, Backbone, HomeView, Experiment01View, Experiment02View, NavView, CanvasControlModel){
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            // Define some URL routes
            'experiment01': 'showExp01',
            'experiment02': 'showExp02',

            // Default
            '*actions': 'defaultAction'
        }

    });



    var initialize = function(){
        var homeView, experiment01View, experiment02View;
        var app_router = new AppRouter;

        function transForm(){
            console.log("transform")
            if( CanvasControlModel.get("previousId") != undefined){
                switch (CanvasControlModel.get("previousId")){
                    case 0:
                        homeView.remove();
                        break;
                    case 1:
                        experiment01View.remove();
                        break;
                    case 2:
                        experiment02View.remove();
                        break;
                }


            }else{
                console.log("transform undefined");
            }

        }

        app_router.on('route:showExp01', function(){

            CanvasControlModel.set("id", 1);
            transForm();
            experiment01View = new Experiment01View();
            CanvasControlModel.set("previousId", 1);
            navView.changeStatus();


        });
        app_router.on('route:showExp02', function(){

            CanvasControlModel.set("id", 2);
            transForm();
            experiment02View = new Experiment02View();
            CanvasControlModel.set("previousId", 2);
            navView.changeStatus();


        });
        app_router.on('route:defaultAction', function(){

            CanvasControlModel.set("id", 0);
            transForm();
            homeView = new HomeView();
            CanvasControlModel.set("previousId", 0);
            navView.changeStatus();


        });

        var navView = new NavView();

        $(window).resize(function(){
            switch (CanvasControlModel.get("id")){
                case 0: homeView.resize(); break;
                case 1: experiment01View.resize(); break;
                case 2: experiment02View.resize(); break;
            }
        });

        $(window).mousemove(function(e){
            var pos = {x: e.pageX, y: e.pageY};
            switch (CanvasControlModel.get("id")){
                case 0: homeView.mouseMove(pos); break;
                case 1: experiment01View.mouseMove(pos); break;
                case 2: experiment02View.mouseMove(pos); break;
            }
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});