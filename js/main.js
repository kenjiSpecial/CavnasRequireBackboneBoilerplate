// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
    paths: {
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore-min',
        backbone: 'libs/backbone/backbone-min',
        templates: '../templates',
        mout: 'libs/mout',
        tweenLite: 'libs/tween/TweenLite.min',
        easing: 'libs/tween/easing/EasePack.min'
    }

});

require([
    'app'
], function(App){
    App.initialize();
});
