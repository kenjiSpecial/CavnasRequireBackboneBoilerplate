define([
    'jquery',
    'underscore',
    'backbone',
    'mout/function/bind',
    'models/canvasControlModel'
], function ($, _, Backbone, bind, CanvasControlModel) {

    function MouseEvent(){
        console.log("mouseEvent");

        var mobileStatus;
        var touchDownStatus, mouseDownStatus;
        var touchPosition, touchVelocity;
        var mousePosition, mouseVelocity;

        var agent = navigator.userAgent;

        if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1) {
            mobileStatus = true;
        } else {
            mobileStatus = false;
        }

        //    addEvent listener
        if (mobileStatus) {
            window.addEventListener("touchstart", touch_start);
            window.addEventListener("touchmove", touch_move);
            window.addEventListener("touchend", touch_end);
        } else {
            window.addEventListener("mousedown", mouse_down);
            window.addEventListener("mousemove", mouse_move);
            window.addEventListener("mouseup", mouse_up);
        }

        function mouse_down(e) {

            mouseDownStatus = true;
            mousePosition = {x: e.x, y: e.y};
            mouseVelocity = {x: 0, y: 0};
        }

        //    ------------------

        function mouse_move(e) {
            if (mouseDownStatus) {

                var posX = e.x;
                var posY = e.y;

                mousePosition = {x: posX, y: posY};

                console.log(mousePosition.x);
            }
        }

        //    ------------------

        function mouse_up(e) {
            mousePosition = {x: e.x, y: e.y};
            mouseVelocity = {x: 0, y: 0};
            mouseDownStatus = false;
        }

        function touch_start(e) {

            var touch = e.touches[0];
            touchDownStatus = true;
            touchPosition = {x: touch.pageX, y: touch.pageY};
            touchVelocity = {x: 0, y: 0};

            e.preventDefault();
        }

        //    ------------------

        function touch_move(e) {
            if (touchDownStatus) {
                var touch = e.touches[0];
                var posX = touch.pageX;
                var posY = touch.pageY;

                touchPosition = {x: posX, y: posY};
            }

            e.preventDefault();

        }

        //    ------------------

        function touch_end(e) {

            touchDownStatus = false;

            touchVelocity = {x: 0, y: 0};
            e.preventDefault();
        }
    }

    return MouseEvent;
});
