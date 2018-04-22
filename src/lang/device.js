/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2017, Olivier Biot, Jason Oster, Aaron McLeod
 * http://www.melonjs.org
 *
 */
(function () {
    /**
     * A singleton object representing the device capabilities and specific events
     * @namespace le.device
     * @memberOf me
     */
    le.device = (function () {
        // defines object for holding public information/functionality.
        var api = {};
        // private properties
        var accelInitialized = false;
        var deviceOrientationInitialized = false;
        var devicePixelRatio = null;

        // swipe utility fn & flag
        var swipeEnabled = true;
        var disableSwipeFn = function (e) {
            e.preventDefault();
            window.scroll(0, 0);
            return false;
        };


        /**
         * check the device capapbilities
         * @ignore
         */
        api._check = function () {

            // detect device type/platform
            le.device._detectDevice();

            // Mobile browser hacks
            if (le.device.isMobile && !le.device.cocoon) {
                // Prevent the webview from moving on a swipe
                api.enableSwipe(false);
            }

            // future proofing (MS) feature detection
            le.device.pointerEvent = le.agent.prefixed("PointerEvent", window);
            le.device.maxTouchPoints = le.agent.prefixed("maxTouchPoints", navigator) || 0;
            window.gesture = le.agent.prefixed("gesture");

            // detect touch capabilities
            le.device.touch = ("createTouch" in document) || ("ontouchstart" in window) ||
                              (le.device.cocoon) || (le.device.pointerEvent && (le.device.maxTouchPoints > 0));

            // detect wheel event support
            // Modern browsers support "wheel", Webkit and IE support at least "mousewheel
            le.device.wheel = ("onwheel" in document.createElement("div"));

            // accelerometer detection
            le.device.hasAccelerometer = (
                (typeof (window.DeviceMotionEvent) !== "undefined") || (
                    (typeof (window.Windows) !== "undefined") &&
                    (typeof (Windows.Devices.Sensors.Accelerometer) === "function")
                )
            );

            // pointerlock detection
            this.hasPointerLockSupport = le.agent.prefixed("pointerLockElement", document);

            if (this.hasPointerLockSupport) {
                document.exitPointerLock = le.agent.prefixed("exitPointerLock", document);
            }

            // device motion detection
            if (window.DeviceOrientationEvent) {
                le.device.hasDeviceOrientation = true;
            }

            // fullscreen api detection & polyfill when possible
            this.hasFullscreenSupport = le.agent.prefixed("fullscreenEnabled", document) ||
                                        document.mozFullScreenEnabled;

            document.exitFullscreen = le.agent.prefixed("cancelFullScreen", document) ||
                                      le.agent.prefixed("exitFullscreen", document);

            // vibration API poyfill
            navigator.vibrate = le.agent.prefixed("vibrate", navigator);

            try {
                api.localStorage = !!window.localStorage;
            } catch (e) {
                // the above generates an exception when cookies are blocked
                api.localStorage = false;
            }

            // set pause/stop action on losing focus
            window.addEventListener("blur", function () {
                // if (me.sys.stopOnBlur) {
                //     me.state.stop(true);
                // }
                // if (me.sys.pauseOnBlur) {
                //     me.state.pause(true);
                // }
            }, false);
            // set restart/resume action on gaining focus
            window.addEventListener("focus", function () {
                // if (me.sys.stopOnBlur) {
                //     me.state.restart(true);
                // }
                // if (me.sys.resumeOnFocus) {
                //     me.state.resume(true);
                // }
            }, false);


            // Set the name of the hidden property and the change event for visibility
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                // Opera 12.10 and Firefox 18 and later support
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document.mozHidden !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }

            // register on the event if supported
            if (typeof (visibilityChange) === "string") {
                // add the corresponding event listener
                document.addEventListener(visibilityChange,
                    function () {
                        if (document[hidden]) {
                            // if (me.sys.stopOnBlur) {
                            //     me.state.stop(true);
                            // }
                            // if (me.sys.pauseOnBlur) {
                            //     me.state.pause(true);
                            // }
                        } else {
                            // if (me.sys.stopOnBlur) {
                            //     me.state.restart(true);
                            // }
                            // if (me.sys.resumeOnFocus) {
                            //     me.state.resume(true);
                            // }
                        }
                    }, false
                );
            }
        };

        /**
         * detect the device type
         * @ignore
         */
        api._detectDevice = function () {
            // iOS Device ?
            le.device.iOS = /iPhone|iPad|iPod/i.test(le.device.ua);
            // Android Device ?
            le.device.android = /Android/i.test(le.device.ua);
            le.device.android2 = /Android 2/i.test(le.device.ua);
            // Chrome OS ?
            le.device.chromeOS = /CrOS/.test(le.device.ua);
            // Windows Device ?
            le.device.wp = /Windows Phone/i.test(le.device.ua);
            // Kindle device ?
            le.device.BlackBerry = /BlackBerry/i.test(le.device.ua);
            // Kindle device ?
            le.device.Kindle = /Kindle|Silk.*Mobile Safari/i.test(le.device.ua);

            // Mobile platform
            le.device.isMobile = /Mobi/i.test(le.device.ua) ||
                                 le.device.iOS ||
                                 le.device.android ||
                                 le.device.wp ||
                                 le.device.BlackBerry ||
                                 le.device.Kindle || false;
            // ejecta
            le.device.ejecta = (typeof window.ejecta !== "undefined");

            // cocoon/cocoonJS
            le.device.cocoon = navigator.isCocoonJS ||  // former cocoonJS
                               (typeof window.Cocoon !== "undefined"); // new cocoon

        };

        /*
         * PUBLIC Properties & Functions
         */

        // Browser capabilities

        /**
         * the `ua` read-only property returns the user agent string for the current browser.
         * @type String
         * @readonly
         * @name ua
         * @memberOf le.device
         */
        api.ua = navigator.userAgent;

        /**
         * Browser Local Storage capabilities <br>
         * (this flag will be set to false if cookies are blocked)
         * @type Boolean
         * @readonly
         * @name localStorage
         * @memberOf le.device
         */
        api.localStorage = false;

        /**
         * Browser accelerometer capabilities
         * @type Boolean
         * @readonly
         * @name hasAccelerometer
         * @memberOf le.device
         */
        api.hasAccelerometer = false;

        /**
         * Browser device orientation
         * @type Boolean
         * @readonly
         * @name hasDeviceOrientation
         * @memberOf le.device
         */
        api.hasDeviceOrientation = false;

        /**
         * Browser full screen support
         * @type Boolean
         * @readonly
         * @name hasFullscreenSupport
         * @memberOf le.device
         */
        api.hasFullscreenSupport = false;

         /**
         * Browser pointerlock api support
         * @type Boolean
         * @readonly
         * @name hasPointerLockSupport
         * @memberOf le.device
         */
        api.hasPointerLockSupport = false;

        /**
         * Browser Base64 decoding capability
         * @type Boolean
         * @readonly
         * @name nativeBase64
         * @memberOf le.device
         */
        api.nativeBase64 = (typeof(window.atob) === "function");

         /**
         * Return the maximum number of touch contacts of current device.
         * @type Number
         * @readonly
         * @name maxTouchPoints
         * @memberOf le.device
         */
        api.maxTouchPoints = 0;

        /**
         * Touch capabilities
         * @type Boolean
         * @readonly
         * @name touch
         * @memberOf le.device
         */
        api.touch = false;

        /**
         * W3C standard wheel events
         * @type Boolean
         * @readonly
         * @name wheel
         * @memberOf le.device
         */
        api.wheel = false;

        /**
         * equals to true if a mobile device <br>
         * (Android | iPhone | iPad | iPod | BlackBerry | Windows Phone | Kindle)
         * @type Boolean
         * @readonly
         * @name isMobile
         * @memberOf le.device
         */
        api.isMobile = false;

        /**
         * equals to true if the device is an iOS platform.
         * @type Boolean
         * @readonly
         * @name iOS
         * @memberOf le.device
         */
        api.iOS = false;

        /**
         * equals to true if the device is an Android platform.
         * @type Boolean
         * @readonly
         * @name android
         * @memberOf le.device
         */
        api.android = false;

        /**
         * equals to true if the device is an Android 2.x platform.
         * @type Boolean
         * @readonly
         * @name android2
         * @memberOf le.device
         */
        api.android2 = false;

       /**
        * equals to true if the game is running under Ejecta.
        * @type Boolean
        * @readonly
        * @see http://impactjs.com/ejecta
        * @name ejecta
        * @memberOf le.device
        */
        api.ejecta = false;

        /**
         * equals to true if the game is running under cocoon/cocoonJS.
         * @type Boolean
         * @readonly
         * @see https://cocoon.io
         * @name cocoon
         * @memberOf le.device
         */
         api.cocoon = false;

        /**
         * equals to true if the device is running on ChromeOS.
         * @type Boolean
         * @readonly
         * @name chromeOS
         * @memberOf le.device
         */
        api.chromeOS = false;

         /**
         * equals to true if the device is a Windows Phone platform.
         * @type Boolean
         * @readonly
         * @name wp
         * @memberOf le.device
         */
        api.wp = false;

        /**
         * equals to true if the device is a BlackBerry platform.
         * @type Boolean
         * @readonly
         * @name BlackBerry
         * @memberOf le.device
         */
        api.BlackBerry = false;

        /**
         * equals to true if the device is a Kindle platform.
         * @type Boolean
         * @readonly
         * @name Kindle
         * @memberOf le.device
         */
        api.Kindle = false;

        /**
         * The device current orientation status. <br>
         *   0 : default orientation<br>
         *  90 : 90 degrees clockwise from default<br>
         * -90 : 90 degrees anti-clockwise from default<br>
         * 180 : 180 degrees from default
         * @type Number
         * @readonly
         * @name orientation
         * @memberOf le.device
         */
        api.orientation = 0;

        /**
         * contains the g-force acceleration along the x-axis.
         * @public
         * @type Number
         * @readonly
         * @name accelerationX
         * @memberOf le.device
         */
        api.accelerationX = 0;

        /**
         * contains the g-force acceleration along the y-axis.
         * @public
         * @type Number
         * @readonly
         * @name accelerationY
         * @memberOf le.device
         */
        api.accelerationY = 0;

        /**
         * contains the g-force acceleration along the z-axis.
         * @public
         * @type Number
         * @readonly
         * @name accelerationZ
         * @memberOf le.device
         */
        api.accelerationZ = 0;

        /**
         * Device orientation Gamma property. Gives angle on tilting a portrait held phone left or right
         * @public
         * @type Number
         * @readonly
         * @name gamma
         * @memberOf le.device
         */
        api.gamma = 0;

        /**
         * Device orientation Beta property. Gives angle on tilting a portrait held phone forward or backward
         * @public
         * @type Number
         * @readonly
         * @name beta
         * @memberOf le.device
         */
        api.beta = 0;

        /**
         * Device orientation Alpha property. Gives angle based on the rotation of the phone around its z axis.
         * The z-axis is perpendicular to the phone, facing out from the center of the screen.
         * @public
         * @type Number
         * @readonly
         * @name alpha
         * @memberOf le.device
         */
        api.alpha = 0;

        /**
         * a string representing the preferred language of the user, usually the language of the browser UI.
         * (will default to "en" if the information is not available)
         * @public
         * @type String
         * @readonly
         * @see http://www.w3schools.com/tags/ref_language_codes.asp
         * @name language
         * @memberOf le.device
         */
        api.language = navigator.language || navigator.browserLanguage || navigator.userLanguage || "en";

        /**
         * enable/disable swipe on WebView.
         * @name enableSwipe
         * @memberOf le.device
         * @function
         * @param {boolean} [enable=true] enable or disable swipe.
         */
        api.enableSwipe = function (enable) {
            if (enable !== false) {
                if (swipeEnabled === false) {
                    window.document.removeEventListener("touchmove", disableSwipeFn, false);
                    swipeEnabled = true;
                }
            } else if (swipeEnabled === true) {
                window.document.addEventListener("touchmove", disableSwipeFn, false);
                swipeEnabled = false;
            }
        };

        /**
         * Triggers a fullscreen request. Requires fullscreen support from the browser/device.
         * @name requestFullscreen
         * @memberOf le.device
         * @function
         * @param {Object} [element=default canvas object] the element to be set in full-screen mode.
         * @example
         * // add a keyboard shortcut to toggle Fullscreen mode on/off
         * me.input.bindKey(me.input.KEY.F, "toggleFullscreen");
         * me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
         *    // toggle fullscreen on/off
         *    if (action === "toggleFullscreen") {
         *       if (!le.device.isFullscreen) {
         *          le.device.requestFullscreen();
         *       } else {
         *          le.device.exitFullscreen();
         *       }
         *    }
         * });
         */
        api.requestFullscreen = function (element) {
            if (this.hasFullscreenSupport) {
                element = element;
                element.requestFullscreen = le.agent.prefixed("requestFullscreen", element) ||
                                            element.mozRequestFullScreen;

                element.requestFullscreen();
            }
        };

        /**
         * Exit fullscreen mode. Requires fullscreen support from the browser/device.
         * @name exitFullscreen
         * @memberOf le.device
         * @function
         */
        api.exitFullscreen = function () {
            if (this.hasFullscreenSupport) {
                document.exitFullscreen();
            }
        };

        /**
         * return the device pixel ratio
         * @name getPixelRatio
         * @memberOf le.device
         * @function
         *
        api.getPixelRatio = function () {

            if (devicePixelRatio === null) {
                var _context;
                if (typeof me.video.renderer !== "undefined") {
                    _context = me.video.renderer.getScreenContext();
                } else {
                    _context = me.Renderer.prototype.getContext2d(document.createElement("canvas"));
                }
                var _devicePixelRatio = window.devicePixelRatio || 1,
                    _backingStoreRatio = le.agent.prefixed("backingStorePixelRatio", _context) || 1;
                devicePixelRatio = _devicePixelRatio / _backingStoreRatio;
            }
            return devicePixelRatio;
        };*/

        /**
         * return the device storage
         * @name getStorage
         * @memberOf le.device
         * @function
         * @param {String} [type="local"]
         * @return me.save object
         *
        api.getStorage = function (type) {

            type = type || "local";

            switch (type) {
                case "local" :
                    return me.save;

                default :
                    throw new me.Error("storage type " + type + " not supported");
            }
        };*/

        /**
         * event management (Accelerometer)
         * http://www.mobilexweb.com/samples/ball.html
         * http://www.mobilexweb.com/blog/safari-ios-accelerometer-websockets-html5
         * @ignore
         */
        function onDeviceMotion(e) {
            if (e.reading) {
                // For Windows 8 devices
                api.accelerationX = e.reading.accelerationX;
                api.accelerationY = e.reading.accelerationY;
                api.accelerationZ = e.reading.accelerationZ;
            }
            else {
                // Accelerometer information
                api.accelerationX = e.accelerationIncludingGravity.x;
                api.accelerationY = e.accelerationIncludingGravity.y;
                api.accelerationZ = e.accelerationIncludingGravity.z;
            }
        }

        function onDeviceRotate(e) {
            api.gamma = e.gamma;
            api.beta = e.beta;
            api.alpha = e.alpha;
        }

        /**
         * Enters pointer lock, requesting it from the user first. Works on supported devices & browsers
         * Must be called in a click event or an event that requires user interaction.
         * If you need to run handle events for errors or change of the pointer lock, see below.
         * @name turnOnPointerLock
         * @memberOf le.device
         * @function
         * @example
         * document.addEventListener("pointerlockchange", pointerlockchange, false);
         * document.addEventListener("mozpointerlockchange", pointerlockchange, false);
         * document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
         *
         * document.addEventListener("pointerlockerror", pointerlockerror, false);
         * document.addEventListener("mozpointerlockerror", pointerlockerror, false);
         * document.addEventListener("webkitpointerlockerror", pointerlockerror, false);
         *
        api.turnOnPointerLock = function () {
            if (this.hasPointerLockSupport) {
                var element = me.video.getWrapper();
                if (le.device.ua.match(/Firefox/i)) {
                    var fullscreenchange = function () {
                        if ((le.agent.prefixed("fullscreenElement", document) ||
                            document.mozFullScreenElement) === element) {

                            document.removeEventListener("fullscreenchange", fullscreenchange);
                            document.removeEventListener("mozfullscreenchange", fullscreenchange);
                            element.requestPointerLock = le.agent.prefixed("requestPointerLock", element);
                            element.requestPointerLock();
                        }
                    };

                    document.addEventListener("fullscreenchange", fullscreenchange, false);
                    document.addEventListener("mozfullscreenchange", fullscreenchange, false);

                    le.device.requestFullscreen();

                }
                else {
                    element.requestPointerLock();
                }
            }
        };*/

        /**
         * Exits pointer lock. Works on supported devices & browsers
         * @name turnOffPointerLock
         * @memberOf le.device
         * @function
         */
        api.turnOffPointerLock = function () {
            if (this.hasPointerLockSupport) {
                document.exitPointerLock();
            }
        };

        /**
         * watch Accelerator event
         * @name watchAccelerometer
         * @memberOf le.device
         * @public
         * @function
         * @return {Boolean} false if not supported by the device
         */
        api.watchAccelerometer = function () {
            if (le.device.hasAccelerometer) {
                if (!accelInitialized) {
                    if (typeof Windows === "undefined") {
                        // add a listener for the devicemotion event
                        window.addEventListener("devicemotion", onDeviceMotion, false);
                    }
                    else {
                        // On Windows 8 Device
                        var accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();
                        if (accelerometer) {
                            // Capture event at regular intervals
                            var minInterval = accelerometer.minimumReportInterval;
                            var Interval = minInterval >= 16 ? minInterval : 25;
                            accelerometer.reportInterval = Interval;

                            accelerometer.addEventListener("readingchanged", onDeviceMotion, false);
                        }
                    }
                    accelInitialized = true;
                }
                return true;
            }
            return false;
        };

        /**
         * unwatch Accelerometor event
         * @name unwatchAccelerometer
         * @memberOf le.device
         * @public
         * @function
         */
        api.unwatchAccelerometer = function () {
            if (accelInitialized) {
                if (typeof Windows === "undefined") {
                    // add a listener for the mouse
                    window.removeEventListener("devicemotion", onDeviceMotion, false);
                } else {
                    // On Windows 8 Devices
                    var accelerometer = Windows.Device.Sensors.Accelerometer.getDefault();

                    accelerometer.removeEventListener("readingchanged", onDeviceMotion, false);
                }
                accelInitialized = false;
            }
        };

        /**
         * watch the device orientation event
         * @name watchDeviceOrientation
         * @memberOf le.device
         * @public
         * @function
         * @return {Boolean} false if not supported by the device
         */
        api.watchDeviceOrientation = function () {
            if (le.device.hasDeviceOrientation && !deviceOrientationInitialized) {
                window.addEventListener("deviceorientation", onDeviceRotate, false);
                deviceOrientationInitialized = true;
            }
            return false;
        };

        /**
         * unwatch Device orientation event
         * @name unwatchDeviceOrientation
         * @memberOf le.device
         * @public
         * @function
         */
        api.unwatchDeviceOrientation = function () {
            if (deviceOrientationInitialized) {
                window.removeEventListener("deviceorientation", onDeviceRotate, false);
                deviceOrientationInitialized = false;
            }
        };

        /**
         * the vibrate method pulses the vibration hardware on the device, <br>
         * If the device doesn't support vibration, this method has no effect. <br>
         * If a vibration pattern is already in progress when this method is called,
         * the previous pattern is halted and the new one begins instead.
         * @name vibrate
         * @memberOf le.device
         * @public
         * @function
         * @param {Number|Number[]} pattern pattern of vibration and pause intervals
         * @example
         * // vibrate for 1000 ms
         * navigator.vibrate(1000);
         * // or alternatively
         * navigator.vibrate([1000]);
         * // vibrate for 50 ms, be still for 100 ms, and then vibrate for 150 ms:
         * navigator.vibrate([50, 100, 150]);
         * // cancel any existing vibrations
         * navigator.vibrate(0);
         */
        api.vibrate = function (pattern) {
            if (navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        };


        return api;
    })();

    /**
     * Returns true if the browser/device is in full screen mode.
     * @name isFullscreen
     * @memberOf le.device
     * @public
     * @type Boolean
     * @readonly
     * @return {boolean}
     *
    Object.defineProperty(le.device, "isFullscreen", {
        get: function () {
            if (le.device.hasFullscreenSupport) {
                var el = le.agent.prefixed("fullscreenElement", document) ||
                         document.mozFullScreenElement;
                return (el === me.video.getWrapper());
            } else {
                return false;
            }
        }
    });*/

    /**
     * Returns true if the browser/device has audio capabilities.
     * @name sound
     * @memberOf le.device
     * @public
     * @type Boolean
     * @readonly
     * @return {boolean}
     *
    Object.defineProperty(le.device, "sound", {
        get: function () {
                return !Howler.noAudio;
        }
    });*/
})();
