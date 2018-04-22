(function(window) {
    if (window.leSetAnimateFrameInterval)
        return;
    // handle multiple browsers for requestAnimationFrame()
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
                return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
            };
    })();
    // handle multiple browsers for cancelAnimationFrame()
    window.cancelAnimationFrame = (function () {
        return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
                window.clearTimeout(id);
            };
    })();

    window.performance = window.performance || {};

    window.performance.now = (function() {
        if (window.performance && window.performance.now)
            return window.performance.now.bind(window.performance);
        else if(Date.now)
            return Date.now.bind(Date);
        else
            return function() {
                return (new Date()).getTime();
            }
    })();

    var callbacks = [];
    window.leSetAnimateFrameInterval = function(func) {
        callbacks.push(func);
    };

    var lastTime = ~~window.performance.now();
    var loop = function() {
        var now = ~~window.performance.now();
        var dt = now - lastTime;
        if (dt > 0) {
            lastTime = now;
            for (var i in callbacks) {
                callbacks[i].call(this, dt, now);
            }
        }
        window.requestAnimationFrame(loop);
    }
    loop();

})(window);