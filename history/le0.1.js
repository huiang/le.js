Object.getPrototypeOf = Object.getPrototypeOf || function (obj) {
    return obj.__proto__;
};
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, prototype) {
    obj.__proto__ = prototype;
    return obj;
};
if (!Object.defineProperty) {
    Object.defineProperty = function (obj, prop, desc) {
        if (obj.__defineGetter__) {
            if (desc.get) {
                obj.__defineGetter__(prop, desc.get);
            }
            if (desc.set) {
                obj.__defineSetter__(prop, desc.set);
            }
        } else {
            throw new TypeError("Object.defineProperty not supported");
        }
    };
}
if (typeof Object.create !== "function") {
    Object.create = function (o) {
        var Fn = function () {};
        Fn.prototype = o;
        return new Fn();
    };
}
if (!Function.prototype.bind) {
    var Empty = function () {};
    Function.prototype.bind = function bind(that) {
        var target = this;
        if (typeof target !== "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var bound = function () {
            if (this instanceof bound) {
                var result = target.apply(this, args.concat(Array.prototype.slice.call(arguments)));
                if (Object(result) === result) {
                    return result;
                }
                return this;
            } else {
                return target.apply(that, args.concat(Array.prototype.slice.call(arguments)));
            }
        };
        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }
        return bound;
    };
}

/**
 * Sourced from: https://gist.github.com/parasyte/9712366
 * Extend a class prototype with the provided mixin descriptors.
 * Designed as a faster replacement for John Resig's Simple Inheritance.
 * @name extend
 * @memberOf external:Object#
 * @function
 * @param {Object[]} mixins... Each mixin is a dictionary of functions, or a
 * previously extended class whose methods will be applied to the target class
 * prototype.
 * @return {Object}
 * @example
 * var Person = Object.extend({
 *     "init" : function (isDancing) {
 *         this.dancing = isDancing;
 *     },
 *     "dance" : function () {
 *         return this.dancing;
 *     }
 * });
 *
 * var Ninja = Person.extend({
 *     "init" : function () {
 *         // Call the super constructor, passing a single argument
 *         this._super(Person, "init", [false]);
 *     },
 *     "dance" : function () {
 *         // Call the overridden dance() method
 *         return this._super(Person, "dance");
 *     },
 *     "swingSword" : function () {
 *         return true;
 *     }
 * });
 *
 * var Pirate = Person.extend(Ninja, {
 *     "init" : function () {
 *         // Call the super constructor, passing a single argument
 *         this._super(Person, "init", [true]);
 *     }
 * });
 *
 * var p = new Person(true);
 * console.log(p.dance()); // => true
 *
 * var n = new Ninja();
 * console.log(n.dance()); // => false
 * console.log(n.swingSword()); // => true
 *
 * var r = new Pirate();
 * console.log(r.dance()); // => true
 * console.log(r.swingSword()); // => true
 *
 * console.log(
 *     p instanceof Person &&
 *     n instanceof Ninja &&
 *     n instanceof Person &&
 *     r instanceof Pirate &&
 *     r instanceof Person
 * ); // => true
 *
 * console.log(r instanceof Ninja); // => false
 */
(function () {
    Object.defineProperty(Object.prototype, "extend", {
        "value" : function () {
            var methods = {};
            var mixins = Array.prototype.slice.call(arguments, 0);

            /**
             * The class constructor which calls the user `init` constructor.
             * @ignore
             */
            function Class() {
                // Call the user constructor
                this.init.apply(this, arguments);
                return this;
            }

            // Apply superClass
            Class.fn = Class.prototype = Object.create(this.prototype);

            // Apply all mixin methods to the class prototype
            mixins.forEach(function (mixin) {
                apply_methods(Class, methods, mixin.__methods__ || mixin);
            });

            // Verify constructor exists
            if (!("init" in Class.prototype)) {
                throw new TypeError(
                    "extend: Class is missing a constructor named `init`"
                );
            }

            // Apply syntactic sugar for accessing methods on super classes
            Object.defineProperty(Class.prototype, "_super", {
                "value" : _super
            });

            // Create a hidden property on the class itself
            // List of methods, used for applying classes as mixins
            Object.defineProperty(Class, "__methods__", {
                "value" : methods
            });

            return Class;
        }
    });

    /**
     * Apply methods to the class prototype.
     * @ignore
     */
    function apply_methods(Class, methods, descriptor) {
        Object.keys(descriptor).forEach(function (method) {
            methods[method] = descriptor[method];

            if (typeof(descriptor[method]) !== "function") {
                throw new TypeError(
                    "extend: Method `" + method + "` is not a function"
                );
            }

            Object.defineProperty(Class.prototype, method, {
                "configurable" : true,
                "value" : descriptor[method]
            });
        });
    }

    /**
     * Special method that acts as a proxy to the super class.
     * @name _super
     * @ignore
     */
    function _super(superClass, method, args) {
        return superClass.prototype[method].apply(this, args);
    }
})();

Math.rand = function(min, max) {
	return Math.random() * (max - min) + min;
};
Number.prototype.clamp = function (low, high) {
    return this < low ? low : this > high ? high : +this;
};
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
/**
 * Executes a function as soon as the interpreter is idle (stack empty).
 * @memberof! external:Function#
 * @alias defer
 * @param {Object} context The execution context of the deferred function.
 * @param {} [arguments...] Optional additional arguments to carry for the
 * function.
 * @return {Number} id that can be used to clear the deferred function using
 * clearTimeout
 * @example
 * // execute myFunc() when the stack is empty,
 * // with the current context and 'myArgument' as parameter
 * myFunc.defer(this, 'myArgument');
 */
Function.prototype.defer = function () {
    return setTimeout(this.bind.apply(this, arguments), 0.01);
};;
window.le = (function() {
	var api = {
		directors: [],
		timer: null,
		loader: null,
		message: null
	};
	api._clock = 0;
	api._ticker = 0;
	this._error = '';

	var self = this;

	api.NOSWALLOW = 2;
	api.NOINSIDE = 4;

	api.REPLACE = 2;

	api.loadDirector = function(mixValue, func) {
		var director = new le.Director(mixValue, func);
		api.directors.push(director);
		return director;
	};

	api.removeDirector = function(director) {
		for (var i in api.directors) {
			if (api.directors == directors) {
				var dtor = api.directors[i];
				dtor._exit();
				api.directors.splice(i, 1);
				break;
			}
		}
	};

	api.reportError = function(e) {
		console.log(e);
		this._error = e;
	};

	var tasks = [];
	var ntasks = [];
	var stepRunning = false;
	api.step = {
		add: function(func) {
			if (stepRunning)
				ntasks.push(func);
			else
				tasks.push(func);
			this.run();
			return this;
		},

		run: function() {
			if (stepRunning)
				return this;
			stepRunning = true;
			while (tasks.length > 0) {
				var last = tasks.shift();
				last();
				tasks = ntasks.concat(tasks);
				ntasks = [];
			}
			stepRunning = false;
		}
	};

	this.update = function(dt) {
		api._clock += dt;
		api._ticker ++;
		if (api.timer) {
			api.timer._update(dt);			
		}
		for (var i in api.directors) {
			api.directors[i].update(dt);
		}
		if (api.timer) {
			api.timer._updateAfterAll();		
		}
		for (var i in api.directors) {
			api.directors[i].update(dt);
		}
	};

	var lastTime = ~~window.performance.now();
	var self = this;
	self.loop = function() {
		// try {
			var now = ~~window.performance.now();
			var dt = now - lastTime;
			if (dt > 0) {
				lastTime = now;
				self.update(dt);
			}
		// } catch (e) {
		// 	if (error == null) {
		// 		self._error = e;
		// 		if (self.showError)
		// 			console.error(e.stack);
		// 	}
		// }
		window.requestAnimationFrame(self.loop);
	}
	self.loop();
	return api;
})();;
(function(window, le){;
(function(){
function MessageInstance(type, data) {
	this.type = type;
	this.swallowed = false;
	this.data = data;
}
MessageInstance.prototype.swallow = function() {
	this.swallowed = true;
};

le.Message = Object.extend({
	init: function() {
		this._list = {};
	},

	listen: function(target, type, callback, priority) {
		if (this._list[type] == undefined) {
			this._list[type] = {lns:[], dirty: 0};
		}
		this._list[type].lns.push({fn:callback, t:target, p:priority ? priority : 0});
		this._list[type].dirty = 1;
	},

	unlisten: function(target, type, callback) {
		var list = this._list;
		if (type !== undefined) {
			if (list[type] != undefined) {
				for(var j = 0, len = list[type].lns.length; j < len; j++) {
					if (list[type].lns[j].t == target && 
						(callback === undefined || callback === list[type].lns[j].fn)
						) {
						list[type].lns[j].fn = null;
						list[type].lns.splice(j, 1);
						j--;
						len--;
					}
				}	
			}
		}
		else {
			for (var type in list) {
				for(var j = 0, len = list[type].lns.length; j < len; j++) {
					if (list[type].lns[j].t == target) {
						list[type].lns[j].fn = null;
						list[type].lns.splice(j, 1);
						j--;
						len--;
					}
				}
			}
		}
	},

	dispatch: function(type, data) {
		if (this._list[type] == undefined) {
			return;
		}
		var temp = this._list[type];
		var instance = new MessageInstance(type, data);
		if (temp.dirty) {
			temp.lns.sort(function(a, b){
				return -(a.p - b.p);
			});
			temp.dirty = 0;
		}
		//copy
		var matches = temp.lns.slice(0);

		for (var i in matches) {
			if (matches[i].fn) {
				matches[i].fn(instance, matches[i].t);
				if (instance.swallowed) {
					break;
				}
			}
		}
	}
});
window._messageSingle = new le.Message();
le.message = window._messageSingle;
})();;
le.Director = Object.extend({
	init: function(mixValue, func) {
		this._error = null;
		this._clock = 0;

		var container = typeof mixValue == 'string' ? document.getElementById(mixValue) : mixValue;
		this.container = container;

		var cwidth = container.clientWidth;
		var cheight = container.clientHeight;

		this.containerSize = {
			w: cwidth,
			h: cheight
		};
		this.winSize = {
			w: cwidth,
			h: cheight
		};
		this.designResolution = 'SHOW_ALL';

		func.call(this, cwidth, cheight);

		this.winScale = {
			sx: this.containerSize.w / this.winSize.w,
			sy: this.containerSize.h / this.winSize.h
		};

		var canvas = document.createElement('canvas');
		canvas.style.position = 'absolute';
		canvas.style.left = '0';
		canvas.style.zIndex = '1000';
		canvas.style.top = '0';
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.width = this.winSize.w;
		canvas.height = this.winSize.h;
		container.appendChild(canvas);

		this.canvas = canvas;
		this._context = canvas.getContext('2d');

		this._cacheCanvas = document.createElement('canvas');
		this._cacheCanvas.width = this.winSize.w;
		this._cacheCanvas.height = this.winSize.h;

		this._cacheContext = this._cacheCanvas.getContext('2d');

		this.world = new le.Layer(this);
		this.world._enter(this);

		this._scenes = [];
		
		this.debugData = {
			objs: 0,
			draws: 0,
			drawTime: 0,
			updateTime: 0,
			fps: 0,
			updateFps: 0,
			drawFps: 0,
			cfps: 0,
			cfpsCountClock: 0,
			cupdateFps: 0,
			cdrawFps: 0
		};

		this._isPause = false;
		
		this.cursors = [];
		this._debugFps = null;
		this.showError = false;
		this._clearBeforeDraw = true;

		this._events = {};
		this.initEvent();
	},

	setDesignResolutionSize: function(width, height, method) {
		this.winSize = {
			w: width,
			h: height
		};
		if (typeof method != 'undefined')
			this.designResolution = method;
	},

	_exit: function() {

	},

	getContext: function() {
		return this._context;
	},

	update: function(dt) {
		var debugData = this.debugData;
		debugData.cfps++;
		if (this.world != null && this._isPause == false) {
			var start = window.performance.now();
			debugData.cupdateFps ++;
			debugData.objs = 0;
			
			this.world.__update(dt, this);

			debugData.updateTime = window.performance.now() - start;

			if (this.world.dirty) {
				if (this._clearBeforeDraw) {
					this._context.clearRect(0, 0, this.winSize.w, this.winSize.h);
					this._cacheContext.clearRect(0, 0, this.winSize.w, this.winSize.h);
				}
				start = window.performance.now();
				debugData.cdrawFps ++;
				debugData.draws = 0;
				this.world.__draw(this._cacheContext, this, null);
				
				this._context.drawImage(this._cacheCanvas, 0, 0);

				debugData.drawTime = window.performance.now() - start;
			}
		}
		debugData.cfpsCountClock += dt;
		if (debugData.cfpsCountClock >= 1000) {
			debugData.updateFps = debugData.cupdateFps;
			debugData.drawFps = debugData.cdrawFps;
			debugData.fps = debugData.cfps;
			debugData.cfpsCountClock -= 1000;
			debugData.cfps = 0;
			debugData.cupdateFps = 0;
			debugData.cdrawFps = 0;
		}

		if (this._debugFps) {
			this._debugFps.__draw(this._context, null, null);
		}
	},

	_updateAfterAll: function() {
		for (var i in this._events) {
			for (var j in this._events[i].v) {
				if (this._events[i].v[j] == null) {
					this._events[i].v.splice(j, 1);
				}
			}
		}
	},

	showFps: function() {
		this._debugFps = new le.DebugFps(this);
	},

	noClearBeforeDraw: function() {
		this._clearBeforeDraw = false;
	},

	initEvent: function() {
	    var self = this;
	    var eventsMap = 
	    [
	    	{'type':'mouseup', 'value':['mouseup']},
	    	{'type':'mousemove', 'value':['mousemove']},
	    	{'type':'mousedown', 'value':['mousedown']},
	    	{'type':'mousecancel', 'value':['mouseout']}
	    ];
	    if (le.device.touch) {
	    	eventsMap = 
		    [
		    	{'type':'mouseup', 'value':['touchend']},
		    	{'type':'mousemove', 'value':['touchmove']},
		    	{'type':'mousedown', 'value':['touchstart']},
		    	{'type':'mousecancel', 'value':['touchcancel']}
		    ];
	    }
	    eventsMap.forEach(function(x) {
	    	x.value.forEach(function(es){
			    self.canvas.addEventListener(es, function(event){
			    	var rect = self.canvas.getBoundingClientRect();
			    	var clientX = event.clientX;
			    	var clientY = event.clientY;
			    	if (event['touches'] != undefined) {
			    		if (event.touches.length > 0) {
				    		clientX = event.touches.item(0).clientX;
				    		clientY = event.touches.item(0).clientY;
			    		}
			    		else if (event.changedTouches != undefined && event.changedTouches.length > 0){
				    		clientX = event.changedTouches.item(0).clientX;
				    		clientY = event.changedTouches.item(0).clientY;
			    		}
			    		else {
			    			console.log('error', event);
			    		}
			    	}
					var ev = new le.MouseEvent(event, (event, clientX - rect.left) / self.winScale.sx, (clientY - rect.top) / self.winScale.sy, x.type);
			    	self.triggerEvent(x.type, ev);
			    });
	    	});
	    });

	    ['keyup', 'keypress', 'keydown'].forEach(function(x){
				document.addEventListener(x, function(event){
					var ev = new le.KeyboardEvent(event, event.key, event.keyCode, x);
			    	self.triggerEvent(x, ev);
			    });
	    });
	},

	triggerEvent: function(type, event) {
		var events = this._events;
		if (events[type] !== undefined) {
			if (events[type].dirty) {
				events[type].v = this.sortWithGlobalZorder(events[type].v);
				events[type].dirty = 0;
			}
			for (var j in events[type].v) {
				if (events[type].v[j] != null)
					events[type].v[j].trigger(type, event);
				if (event.swallowed)
					break;
			}
		}
	},

	sortWithGlobalZorder: function(varr) {
		var temp = [];
		for (var j in varr) {
			if (varr[j] == null)
				continue;
			temp.push({t: varr[j], os: varr[j].getParentsOrder()});
		}
		temp.sort(function(a, b) {
			var len1 = a.os.length;
			var len2 = b.os.length;
			for (var i = 0; i < len1 && i < len2; i++) {
				if (a.os[i] == b.os[i]) {
					continue;
				}
				else {
					return a.os[i] > b.os[i] ? -1 : 1;
				}
			}
			le.director.reportError('sortWithGlobalZorder error.');
			return -(len1 - len2);
		});
		var ret = [];
		for (var i in temp) {
			ret.push(temp[i].t);
		}
		return ret;
	},

	_register: function(target, type) {
		var events = this._events;
		if (events[type] === undefined) {
			events[type] = {m: 0, v:[], dirty: 0};
		}
		events[type].v.push(target);
		events[type].dirty = 1;
	},

	_unregister: function(target, type) {
		var events = this._events;
		for (var i in events) {
			if (typeof type !== 'undefined' && type != i )
				continue;
			for (j in events[i].v) {
				if (events[i].v[j] == target)
					events[i].v[j] = null;
			}
		}
	},
	
	currentScene: function() {
		return self._scenes > 0 ? self._scenes[self._scenes.length - 1] : null;
	},

	//**
	startScene: function(scene, flag) {
		flag = typeof flag === 'undefined' ? 0 : flag;
		var self = this;
		le.step.add(function(){
			if (self._scenes.length > 0) {
				var last = self._scenes[self._scenes.length - 1];
				if (flag & le.REPLACE) {
					self._scenes.pop();
				}
				last._doFinish();
			}
		})
		.add(function(){
			self._scenes.push(scene);
			scene._doStart(self, self.world);
		});
	},

	finishScene: function(scene) {
		var self = this;
		if (self._scenes.length > 0) {
			var index  = self._scenes.indexOf(scene);
			if (index < 0) {
				return false;
			}
			else if (index == self._scenes.length - 1) {
				le.step.add(function(){
					self._scenes.pop();
					scene._doFinish();
				})
				.add(function(){
					if (self._scenes.length > 0) {
						var last = self._scenes[self._scenes.length - 1];
						last._doStart(self, self.world);
					}
				});
			}
			else {
				self._scenes.splice(index, 1);
			}
		}		
	},

	// replaceSceneWithIndex: function(scene, index) {
	// 	if (index >= this._scenes.length - 1 || this._scenes.length <= 0) {
	// 		this.startScene(scene, le.REPLACE);
	// 	}
	// 	else  {
	// 		var self = this;
	// 		le.step.add(function(){
	// 			var last = self._scenes[self._scenes.length - 1];
	// 			last._doFinish();
	// 		})
	// 		.add(function(){
	// 			while (self._scenes.length > index -1) {
	// 				self._scenes.pop();
	// 			}
	// 			self.startScene(scene, le.REPLACE);
	// 		});
	// 	}
	// },

	popSceneTo: function(index) {
		if (index >= this._scenes.length)
			return;
		var self = this;
		le.step.add(function(){
			if (this._scenes.length > 0) {
				var last = self._scenes[self._scenes.length - 1];
				last._doFinish();
			}
		})
		.add(function(){
			while (self._scenes.length > index -1) {
				self._scenes.pop();
			}
			var last = self._scenes[self._scenes.length - 1];
			last._doStart(self, self.world);			
		});
	}
});;
/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2017, Olivier Biot, Jason Oster, Aaron McLeod
 * http://www.melonjs.org/
 *
 */
(function () {
    /**
     * Convert first character of a string to uppercase, if it's a letter.
     * @ignore
     * @function
     * @name capitalize
     * @param  {String} str Input string.
     * @return {String} String with first letter made uppercase.
     */
    var capitalize = function (str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
    };

    /**
     * A collection of utilities to ease porting between different user agents.
     * @namespace le.agent
     * @memberOf me
     */
    le.agent = (function () {
        var api = {};

        /**
         * Known agent vendors
         * @ignore
         */
        var vendors = [ "ms", "MS", "moz", "webkit", "o" ];

        /**
         * Get a vendor-prefixed property
         * @public
         * @name prefixed
         * @function
         * @param {String} name Property name
         * @param {Object} [obj=window] Object or element reference to access
         * @return {Mixed} Value of property
         * @memberOf le.agent
         */
        api.prefixed = function (name, obj) {
            obj = obj || window;
            if (name in obj) {
                return obj[name];
            }

            var uc_name = capitalize(name);

            var result;
            vendors.some(function (vendor) {
                var name = vendor + uc_name;
                return (result = (name in obj) ? obj[name] : undefined);
            });
            return result;
        };

        /**
         * Set a vendor-prefixed property
         * @public
         * @name setPrefixed
         * @function
         * @param {String} name Property name
         * @param {Mixed} value Property value
         * @param {Object} [obj=window] Object or element reference to access
         * @memberOf le.agent
         */
        api.setPrefixed = function (name, value, obj) {
            obj = obj || window;
            if (name in obj) {
                obj[name] = value;
                return;
            }

            var uc_name = capitalize(name);

            vendors.some(function (vendor) {
                var name = vendor + uc_name;
                if (name in obj) {
                    obj[name] = value;
                    return true;
                }
                return false;
            });
        };

        return api;
    })();
})();
;
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
;
le.Timer = function() {
	this._id = 0;
	this._timers = [];
};
le.Timer.prototype._update = function(dt) {
	var timers = this._timers;
	for (var i = timers.length - 1; i >= 0; i--) {
		if (timers[i].id < 0) {
			timers.splice(i, 1);
		}
	}
	for (var i = 0; i < timers.length; i++) {
		if (timers[i].id < 0)
			continue;
		if (timers[i].n == -1) {
			timers[i].n = 0;
			timers[i].c = 0;		
		}
		else {
			timers[i].n += dt;
			timers[i].c += dt;
		}
		if (timers[i].n >= timers[i].iv) {
			timers[i].fn(timers[i].n, timers[i].c);
			if (timers[i].t >= 0 && timers[i].c >= timers[i].t) {
				timers[i].id = -1;
			}
			timers[i].n %= timers[i].iv;
		}
	}
	// for (var i = len, nlen = this._timers.length; i < nlen; i++) {
	// 	if (this._timers[i].id < 0)
	// 		continue;
	// 	if (this._timers[i].t == 0) {
	// 		le.timer.callAfterAll(this._timers[i].fn);
	// 		this._timers[i].id = -1;
	// 	}
	// }
};
le.Timer.prototype.setTimeout = function(callback, delay) {
	delay = typeof delay == 'undefined' ? 0 : delay;
	this._timers.push({
		iv: delay,
		c: 0,
		n: -1,
		t: delay,
		fn: callback,
		id: ++this._id //id<0 clear
	});
};

//interval <=0 为每帧都执行，
//times -1为永久执行
//times 不保证执行次数，保证执行时间
le.Timer.prototype.setInterval = function(callback, interval, times) {
	interval = typeof interval == 'undefined' ? -1 : interval;
	times = typeof times == 'undefined' ? -1 : times;
	if (times == 0)
		return;
	this._timers.push({
		iv: interval,
		c: 0,
		n: -1,
		t: times < 0 ? -1 : times * (interval > 0 ? interval : 1000/60),
		fn: callback,
		id: ++this._id //id<0 clear
	});
};
le.Timer.prototype.clearTimer = function(timerId) {
	for (var i = 0, len = this._timers.length; i < len; i++) {
		if (this._timers[i].id == timerId) {
			this._timers[i].id = -1;
			break;
		}		
	}
};
(function() {
	le.timer = new le.Timer();
	var afterAlls = [];
	le.timer.callAfterAll = function(callback) {
		afterAlls.push(callback);
	};
	le.timer._updateAfterAll = function() {
		for (var i = 0, len = afterAlls.length; i < len; i++) {
			afterAlls[i](0, 0);
		}
		afterAlls = [];
	};
	le.timer.now = function() {
		return le._clock;
	};
	le.timer.ticker = function() {
		return le._ticker;
	};
})();;
//照抄melonjs loader
/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2017, Olivier Biot, Jason Oster, Aaron McLeod
 * http://www.melonjs.org
 *
 */
(function () {
    /**
     * a small class to manage loading of stuff and manage resources
     * There is no constructor function for me.input.
     * @namespace me.loader
     * @memberOf me
     */
    le.loader = (function () {
        // hold public stuff in our singleton
        var api = {};

        // contains all the images loaded
        var imgList = {};
        // contains all the TMX loaded
        var tmxList = {};
        // contains all the binary files loaded
        var binList = {};
        // contains all the JSON files
        var jsonList = {};
        
        // flag to check loading status
        var resourceCount = 0;
        var loadCount = 0;
        var timerId = 0;

        /**
         * check the loading status
         * @ignore
         */
        function checkLoadStatus(onload) {
            if (loadCount === resourceCount) {
                // wait 1/2s and execute callback (cheap workaround to ensure everything is loaded)
                if (onload || api.onload) {
                    // make sure we clear the timer
                    clearTimeout(timerId);
                    // trigger the onload callback
                    // we call either the supplied callback (which takes precedence) or the global one
                    var callback = onload || api.onload;
                    setTimeout(function () {
                        callback();
                    }, 300);
                }
                else {
                    console.error("no load callback defined");
                }
            }
            else {
                timerId = setTimeout(function() {
                    checkLoadStatus(onload);
                }, 100);
            }
        }

        /**
         * load Images
         * @example
         * preloadImages([
         *     { name : 'image1', src : 'images/image1.png'},
         *     { name : 'image2', src : 'images/image2.png'},
         *     { name : 'image3', src : 'images/image3.png'},
         *     { name : 'image4', src : 'images/image4.png'}
         * ]);
         * @ignore
         */
        function preloadImage(img, onload, onerror) {
            // create new Image object and add to list
            imgList[img.name] = new Image();
            imgList[img.name].onload = onload;
            imgList[img.name].onerror = onerror;
            if (typeof (api.crossOrigin) === "string") {
                imgList[img.name].crossOrigin = api.crossOrigin;
            }
            imgList[img.name].src = img.src + api.nocache;
        }

        /**
         * preload TMX files
         * @ignore
         */
        function preloadTMX(tmxData, onload, onerror) {
            function addToTMXList(data) {
                // set the TMX content
                tmxList[tmxData.name] = data;

                // add the tmx to the levelDirector
                if (tmxData.type === "tmx") {
                    me.levelDirector.addTMXLevel(tmxData.name);
                }
            }


            //if the data is in the tmxData object, don't get it via a XMLHTTPRequest
            if (tmxData.data) {
                addToTMXList(tmxData.data);
                onload();
                return;
            }

            var xmlhttp = new XMLHttpRequest();
            // check the data format ('tmx', 'json')
            var format = me.utils.getFileExtension(tmxData.src);

            if (xmlhttp.overrideMimeType) {
                if (format === "json") {
                    xmlhttp.overrideMimeType("application/json");
                }
                else {
                    xmlhttp.overrideMimeType("text/xml");
                }
            }

            xmlhttp.open("GET", tmxData.src + api.nocache, true);


            // set the callbacks
            xmlhttp.ontimeout = onerror;
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    // status = 0 when file protocol is used, or cross-domain origin,
                    // (With Chrome use "--allow-file-access-from-files --disable-web-security")
                    if ((xmlhttp.status === 200) || ((xmlhttp.status === 0) && xmlhttp.responseText)) {
                        var result = null;

                        // parse response
                        switch (format) {
                            case "xml":
                            case "tmx":
                            case "tsx":
                                // ie9 does not fully implement the responseXML
                                if (me.device.ua.match(/msie/i) || !xmlhttp.responseXML) {
                                    if (window.DOMParser) {
                                        // manually create the XML DOM
                                        result = (new DOMParser()).parseFromString(xmlhttp.responseText, "text/xml");
                                    } else {
                                        throw new Error("XML file format loading not supported, use the JSON file format instead");
                                    }
                                }
                                else {
                                    result = xmlhttp.responseXML;
                                }
                                // converts to a JS object
                                var data = me.TMXUtils.parse(result);
                                switch (format) {
                                    case "tmx":
                                        result = data.map;
                                        break;

                                    case "tsx":
                                        result = data.tilesets[0];
                                        break;
                                }

                                break;

                            case "json":
                                result = JSON.parse(xmlhttp.responseText);
                                break;

                            default:
                                throw new Error("TMX file format " + format + "not supported !");
                        }

                        //set the TMX content
                        addToTMXList(result);

                        // fire the callback
                        onload();
                    }
                    else {
                        onerror();
                    }
                }
            };
            // send the request
            xmlhttp.send(null);
        }

        /**
         * preload TMX files
         * @ignore
         */
        function preloadJSON(data, onload, onerror) {
            var xmlhttp = new XMLHttpRequest();

            if (xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType("application/json");
            }

            xmlhttp.open("GET", data.src + api.nocache, true);

            // set the callbacks
            xmlhttp.ontimeout = onerror;
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    // status = 0 when file protocol is used, or cross-domain origin,
                    // (With Chrome use "--allow-file-access-from-files --disable-web-security")
                    if ((xmlhttp.status === 200) || ((xmlhttp.status === 0) && xmlhttp.responseText)) {
                        // get the Texture Packer Atlas content
                        jsonList[data.name] = JSON.parse(xmlhttp.responseText);
                        // fire the callback
                        onload();
                    }
                    else {
                        onerror();
                    }
                }
            };
            // send the request
            xmlhttp.send(null);
        }

        /**
         * preload Binary files
         * @ignore
         */
        function preloadBinary(data, onload, onerror) {
            var httpReq = new XMLHttpRequest();

            // load our file
            httpReq.open("GET", data.src + api.nocache, true);
            httpReq.responseType = "arraybuffer";
            httpReq.onerror = onerror;
            httpReq.onload = function () {
                var arrayBuffer = httpReq.response;
                if (arrayBuffer) {
                    var byteArray = new Uint8Array(arrayBuffer);
                    var buffer = [];
                    for (var i = 0; i < byteArray.byteLength; i++) {
                        buffer[i] = String.fromCharCode(byteArray[i]);
                    }
                    binList[data.name] = buffer.join("");
                    // callback
                    onload();
                }
            };
            httpReq.send();
        }

        /**
         * to enable/disable caching
         * @ignore
         */
        api.nocache = "";

        /*
         * PUBLIC STUFF
         */

        /**
         * onload callback
         * @public
         * @function
         * @name onload
         * @memberOf me.loader
         * @example
         * // set a callback when everything is loaded
         * me.loader.onload = this.loaded.bind(this);
         */
        api.onload = undefined;

        /**
         * onProgress callback<br>
         * each time a resource is loaded, the loader will fire the specified function,
         * giving the actual progress [0 ... 1], as argument, and an object describing the resource loaded
         * @public
         * @function
         * @name onProgress
         * @memberOf me.loader
         * @example
         * // set a callback for progress notification
         * me.loader.onProgress = this.updateProgress.bind(this);
         */
        api.onProgress = undefined;


        /**
         * crossOrigin attribute to configure the CORS requests for Image data element.<br>
         * By default (that is, when the attribute is not specified), CORS is not used at all. <br>
         * The "anonymous" keyword means that there will be no exchange of user credentials via cookies, <br>
         * client-side SSL certificates or HTTP authentication as described in the Terminology section of the CORS specification.<br>
         * @public
         * @type String
         * @name crossOrigin
         * @memberOf me.loader
         * @see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes
         * @example
         *  // allow for cross-origin texture loading in WebGL
         * me.loader.crossOrigin = "anonymous";
         *
         * // set all ressources to be loaded
         * me.loader.preload(game.resources, this.loaded.bind(this));
         */
        api.crossOrigin = undefined;

        /**
         * on error callback for image loading
         * @ignore
         */
        api.onLoadingError = function (res) {
            throw new Error("Failed loading resource " + res.src);
        };

        /**
         * enable the nocache mechanism
         * @ignore
         */
        api.setNocache = function (enable) {
            api.nocache = enable ? "?" + ~~(Math.random() * 10000000) : "";
        };


        /**
         * set all the specified game resources to be preloaded.
         * @name preload
         * @memberOf me.loader
         * @public
         * @function
         * @param {Object[]} resources
         * @param {String} resources.name internal name of the resource
         * @param {String} resources.type  "audio", binary", "image", "json", "tmx", "tsx"
         * @param {String} resources.src  path and/or file name of the resource (for audio assets only the path is required)
         * @param {Boolean} [resources.stream] set to true if you don't have to wait for the audio file to be fully downloaded
         * @param {function} [onload=me.loader.onload] function to be called when all resources are loaded
         * @param {boolean} [switchToLoadState=true] automatically switch to the loading screen
         * @example
         * game_resources = [
         *   // PNG tileset
         *   {name: "tileset-platformer", type: "image",  src: "data/map/tileset.png"},
         *   // PNG packed texture
         *   {name: "texture", type:"image", src: "data/gfx/texture.png"}
         *   // TSX file
         *   {name: "meta_tiles", type: "tsx", src: "data/map/meta_tiles.tsx"},
         *   // TMX level (XML & JSON)
         *   {name: "map1", type: "tmx", src: "data/map/map1.json"},
         *   {name: "map2", type: "tmx", src: "data/map/map2.tmx"},
         *   {name: "map3", type: "tmx", format: "json", data: {"height":15,"layers":[...],"tilewidth":32,"version":1,"width":20}},
         *   {name: "map4", type: "tmx", format: "xml", data: {xml representation of tmx}},
         *   // audio resources
         *   {name: "bgmusic", type: "audio",  src: "data/audio/"},
         *   {name: "cling",   type: "audio",  src: "data/audio/"},
         *   // binary file
         *   {name: "ymTrack", type: "binary", src: "data/audio/main.ym"},
         *   // JSON file (used for texturePacker)
         *   {name: "texture", type: "json", src: "data/gfx/texture.json"}
         * ];
         * ...
         * // set all resources to be loaded
         * me.loader.preload(game.resources, this.loaded.bind(this));
         */
        api.preload = function (res, onload) {
            // parse the resources
            for (var i = 0; i < res.length; i++) {
                resourceCount += api.load(
                    res[i],
                    api.onResourceLoaded.bind(api, res[i]),
                    api.onLoadingError.bind(api, res[i])
                );
            }
            // set the onload callback if defined
            if (typeof(onload) !== "undefined") {
                api.onload = onload;
            }

            // check load status
            checkLoadStatus(onload);
        };

        /**
         * Load a single resource (to be used if you need to load additional resource during the game)
         * @name load
         * @memberOf me.loader
         * @public
         * @function
         * @param {Object} resource
         * @param {String} resource.name internal name of the resource
         * @param {String} resource.type  "audio", binary", "image", "json", "tmx", "tsx"
         * @param {String} resource.src  path and/or file name of the resource (for audio assets only the path is required)
         * @param {Boolean} [resource.stream] set to true if you don't have to wait for the audio file to be fully downloaded
         * @param {Function} onload function to be called when the resource is loaded
         * @param {Function} onerror function to be called in case of error
         * @example
         * // load an image asset
         * me.loader.load({name: "avatar",  type:"image",  src: "data/avatar.png"}, this.onload.bind(this), this.onerror.bind(this));
         *
         * // start loading music
         * me.loader.load({
         *     name   : "bgmusic",
         *     type   : "audio",
         *     src    : "data/audio/"
         * }, function () {
         *     me.audio.play("bgmusic");
         * });
         */
        api.load = function (res, onload, onerror) {
            // check ressource type
            switch (res.type) {
                case "binary":
                    // reuse the preloadImage fn
                    preloadBinary.call(this, res, onload, onerror);
                    return 1;

                case "image":
                    // reuse the preloadImage fn
                    preloadImage.call(this, res, onload, onerror);
                    return 1;

                case "json":
                    preloadJSON.call(this, res, onload, onerror);
                    return 1;

                case "tmx":
                case "tsx":
                    preloadTMX.call(this, res, onload, onerror);
                    return 1;

                // case "audio":
                //     me.audio.load(res, !!res.stream, onload, onerror);
                //     return 1;

                default:
                    throw new Error("load : unknown or invalid resource type : " + res.type);
            }
        };

        /**
         * unload specified resource to free memory
         * @name unload
         * @memberOf me.loader
         * @public
         * @function
         * @param {Object} resource
         * @return {Boolean} true if unloaded
         * @example me.loader.unload({name: "avatar",  type:"image",  src: "data/avatar.png"});
         */
        api.unload = function (res) {
            switch (res.type) {
                case "binary":
                    if (!(res.name in binList)) {
                        return false;
                    }

                    delete binList[res.name];
                    return true;

                case "image":
                    if (!(res.name in imgList)) {
                        return false;
                    }
                    if (typeof(imgList[res.name].dispose) === "function") {
                        // cocoonJS implements a dispose function to free
                        // corresponding allocated texture in memory
                        imgList[res.name].dispose();
                    }
                    delete imgList[res.name];
                    return true;

                case "json":
                    if (!(res.name in jsonList)) {
                        return false;
                    }

                    delete jsonList[res.name];
                    return true;

                case "tmx":
                case "tsx":
                    if (!(res.name in tmxList)) {
                        return false;
                    }

                    delete tmxList[res.name];
                    return true;

                // case "audio":
                //     return me.audio.unload(res.name);

                default:
                    throw new Error("unload : unknown or invalid resource type : " + res.type);
            }
        };

        /**
         * unload all resources to free memory
         * @name unloadAll
         * @memberOf me.loader
         * @public
         * @function
         * @example me.loader.unloadAll();
         */
        api.unloadAll = function () {
            var name;

            // unload all binary resources
            for (name in binList) {
                if (binList.hasOwnProperty(name)) {
                    api.unload({
                        "name" : name,
                        "type" : "binary"
                    });
                }
            }

            // unload all image resources
            for (name in imgList) {
                if (imgList.hasOwnProperty(name)) {
                    api.unload({
                        "name" : name,
                        "type" : "image"
                    });
                }
            }

            // unload all tmx resources
            for (name in tmxList) {
                if (tmxList.hasOwnProperty(name)) {
                    api.unload({
                        "name" : name,
                        "type" : "tmx"
                    });
                }
            }

            // unload all in json resources
            for (name in jsonList) {
                if (jsonList.hasOwnProperty(name)) {
                    api.unload({
                        "name" : name,
                        "type" : "json"
                    });
                }
            }

            // unload all audio resources
            // me.audio.unloadAll();
        };

        /**
         * return the specified TMX/TSX object
         * @name getTMX
         * @memberOf me.loader
         * @public
         * @function
         * @param {String} tmx name of the tmx/tsx element ("map1");
         * @return {XML|Object}
         */
        api.getTMX = function (elt) {
            // force as string
            elt = "" + elt;
            if (elt in tmxList) {
                return tmxList[elt];
            }
            else {
                //console.log ("warning %s resource not yet loaded!",name);
                return null;
            }
        };

        /**
         * return the specified Binary object
         * @name getBinary
         * @memberOf me.loader
         * @public
         * @function
         * @param {String} name of the binary object ("ymTrack");
         * @return {Object}
         */
        api.getBinary = function (elt) {
            // force as string
            elt = "" + elt;
            if (elt in binList) {
                return binList[elt];
            }
            else {
                //console.log ("warning %s resource not yet loaded!",name);
                return null;
            }

        };

        /**
         * return the specified Image Object
         * @name getImage
         * @memberOf me.loader
         * @public
         * @function
         * @param {String} Image name of the Image element ("tileset-platformer");
         * @return {Image}
         */
        api.getImage = function (elt) {
            // force as string
            elt = "" + elt;
            if (elt in imgList) {
                // return the corresponding Image object
                return imgList[elt];
            }
            else {
                //console.log ("warning %s resource not yet loaded!",name);
                return null;
            }

        };

        /**
         * return the specified JSON Object
         * @name getJSON
         * @memberOf me.loader
         * @public
         * @function
         * @param {String} Name for the json file to load
         * @return {Object}
         */
        api.getJSON = function (elt) {
            // force as string
            elt = "" + elt;
            if (elt in jsonList) {
                return jsonList[elt];
            }
            else {
                return null;
            }
        };

        /**
         * Return the loading progress in percent
         * @name getLoadProgress
         * @memberOf me.loader
         * @public
         * @function
         * @deprecated use callback instead
         * @return {Number}
         */
        api.getLoadProgress = function () {
            return loadCount / resourceCount;
        };

        // return our object
        return api;
    })();
})();
;
window.le.SpriteFrame = Object.extend({
	init: function(image, sets) {
		this.image = image;
		this.frame = sets.frame;
		this.rotated = sets.rotated;
		this.spriteSourceSize = sets.spriteSourceSize;
		this.sourceSize = sets.sourceSize;

		//scale
		//this.spriteSourceSize.x = this.spriteSourceSize.x * scale;
		//this.spriteSourceSize.y = this.spriteSourceSize.y * scale;
		//this.spriteSourceSize.w = this.spriteSourceSize.w * scale;
		//this.spriteSourceSize.h = this.spriteSourceSize.h * scale;
		//this.sourceSize.w = this.sourceSize.w * scale;
		//this.sourceSize.h = this.sourceSize.w * scale;
	}
});;
(function(){
	le.spriteFrameCache = (function() {
		var api = {};

		var list = {};

		api.add = function(image, map) {
			for (var i in map.frames) {
				list[i] = new le.SpriteFrame(image, map.frames[i]);
			}
		};

		api.get = function(name) {
			if (name in list)
				return list[name];
			else
				return null;
		};
		return api;
	})();
})();;
le.Sysfont = Object.extend({
	init: function(fontFamily, fontSize, color) {
		this.fontWeight = '';
		this.fontStyle = '';
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;

		this.color = color;

		this._font = [this.fontWeight, this.fontStyle, this.fontSize + 'px', this.fontFamily].join(' ');
	},

	attr: function(settings) {
		for (i in settings) {
			this[i] = settings[i];
		}
		this._font = [this.fontWeight, this.fontStyle, this.fontSize + 'px', this.fontFamily].join(' ');
		return this;
	},

	clone: function(settings) {
		return new le.SysFont().attr({
			fontWeight: this.fontWeight,
			fontStyle: this.fontStyle,
			fontSize: this.fontSize,
			fontFamily: this.fontFamily,
			color: this.color
		});
	},

	beginMeasure: function(ctx) {
		ctx.font = this._font;
	},

	measure: function(ctx, text) {
		return ctx.measureText(text).width;
	},

	beginDraw: function(ctx, textAlign, textBaseline) {
		ctx.font = this._font;
		ctx.fillStyle = this.color;
		ctx.textAlign = textAlign;
		ctx.textBaseline = textBaseline;
	},

	fillText: function (ctx, text, x, y) {
		ctx.fillText(text, x, y);
	}
});;
le.BitmapFont = Object.extend({
	init: function(fontFamily, fontSize) {
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;
		this._space = 0;
	},

	attr: function(settings) {
		for (i in settings) {
			this[i] = settings[i];
		}
		return this;
	},

	setSpace: function(sp) {
		this._space = sp;
	},

	clone: function(settings) {
		return new le.BitmapFont().attr({
			fontSize: this.fontSize,
			fontFamily: this.fontFamily
		});
	},

	beginMeasure: function(ctx) {
	},

	measure: function(ctx, text) {
		var width = 0;
		for (var i = 0, len = text.length; i < len; i++) {
			var c = text.charCodeAt(i);
			var name = c.toString(16);;
			if (c <= 255) {
				name = "00" + name;
			}
			else if (c <= 4095) {
				name = "0" + name;
			}
			name = this.fontFamily + "_" + name + ".png"
			var frame = le.spriteFrameCache.get(name)
			if (frame != null) {				
				width += frame.sourceSize.w + this._space;
			}
		}
		if (width > 0)
			width -= this._space;
		return width;
	},

	beginDraw: function(ctx, textAlign, textBaseline) {
	},

	fillText: function (ctx, text, x, y) {
		var xpos = 0, ypos = -this.fontSize/2;
		for (var i = 0, len = text.length; i < len; i++) {
			var c = text.charCodeAt(i);
			var name = c.toString(16);;
			if (c <= 255) {
				name = "00" + name;
			}
			else if (c <= 4095) {
				name = "0" + name;
			}
			name = this.fontFamily + "_" + name + ".png"
			var frame = le.spriteFrameCache.get(name)
			if (frame != null) {				
				ctx.drawImage(frame.image, frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, xpos + x + frame.spriteSourceSize.x, ypos + y + frame.spriteSourceSize.y, frame.spriteSourceSize.w, frame.spriteSourceSize.h);
				xpos += frame.sourceSize.w + this._space;
			}
		}
	}
});;
le.Node = Object.extend({
	init: function() {
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;

		this.anchorX = 0;
		this.anchorY = 0;

		this.opacity = 1;
		this.rotation = 0;
		this.scaleX = 1;
		this.scaleY = 1;

		this._zIndex = 0;
			
		this.visible = true;
		this.dirty = 1 | 2; //1位 outDirty, 2位 contentDirty
		
		this.name = null;
		this.parent = null;
		this._director = null;

		this.children = [];

		this._cacheContent = 0;
		//invisible
		// this.__cacheMargin
		// this.__cacheCanvas
		this._actions = null;
		this._timer = null;

		this._msgs = null;
		this._events = null;
		
		//debug
		this._showBorder = false;
	},

	pos: function(x, y) {
		this.x = x;
		this.y = y;
		this.dirty |= 1;
		return this;
	},

	posX: function(x) {
		this.x = x;
		this.dirty |= 1;
		return this;
	},

	posY: function(y) {
		this.y = y;
		this.dirty |= 1;
		return this;
	},

	scale: function(sx, sy) {
		this.scaleX = sx;
		this.scaleY = (typeof sy === 'undefined') ? sx : sy;
		this.dirty |= 1;
		return this;
	},

	anchor: function(ax, ay) {
		this.anchorX = ax;
		this.anchorY = (typeof ay === 'undefined') ? ax : ay;
		this.dirty |= 1;
		return this;
	},

	size: function(w, h) {
		this.w = w;
		this.h = h;
		this.dirty |= 2;
		return this;
	},

	showBorder: function() {
		this._showBorder = true;
		this.dirty |= 1;
		return this;
	},

	setRotation: function(angle) {
		this.rotation = angle;
		this.dirty |= 1;
		return this;
	},

	setOpacity: function(opa) {
		this.opacity = opa;
		this.dirty |= 2;
		return this;
	},

	setZIndex: function(index) {
		this._zIndex = index;
		this.dirty |= 1;
		return this;
	},

	setVisible: function(visible) {
		this.visible = visible;
		this.dirty |= 1;
		return this;
	},

	setName: function(name) {
		this.name = name;
		return this;
	},

	contentDirty: function() {
		this.dirty |= 2;
		return this;
	},

	outerDirty: function() {
		this.dirty |= 1;
		return this;
	},

	_clearDirty: function() {
		this.dirty = 0;
		for (var i = 0; i < this.children.length; i++) {
			le.Node.prototype._clearDirty.call(this.children[i]);
		}
	},

	getAttr: function(keys) {
		if (typeof keys === 'string') {
			return keys;
		}
		else {
			var ret = {};
			for (var i = 0, len = keys.length; i < len; i++) {
				ret[keys[i]] = this[keys[i]];
			}
			return ret;
		}
	},

	cacheContent: function(margin, clearBeforeDraw) {
		this._cacheContent |= clearBeforeDraw ? 3 : 1;
		this.__cacheMargin = margin || 0; 
		if (this.__cacheMargin == 0)
			this._cacheContent |= 4;
		this.dirty |= 2;
		return this;
	},

	clip: function(autoHide) {
		this._cacheContent |= 8;
		if (autoHide)
			this._cacheContent |= 16;
		this.dirty |= 2;
		return this;
	},

	enableClipInherit: function() {
		this._cacheContent |= 32;
		this.dirty |= 2;
		return this;
	},

	appendTo: function(parent) {
		parent.addChild(this);
		return this;
	},

	addChild: function() {
		for (var i = 0; i < arguments.length; i++) {
			var isInsert = false;
			for (var j = this.children.length - 1; j >= 0; j--) {
				if (this.children[j]._zIndex <= arguments[i]._zIndex) {
					this.children.splice(j + 1, 0, arguments[i]);
					isInsert = true;
					break;
				}
			}
			if (isInsert == false) {
				this.children.unshift(arguments[i]);
			}
			if (arguments[i].parent !== null) {
				throw new Error("add failed since parent is not null.");
			}
			arguments[i].parent = this;
			if (this.isRunning()) {
				arguments[i]._enter(this._director);
			}
			if (this._upnodes != null)
				this._upnodes.push(arguments[i]);
		}
		this.dirty |= 2;
		return this;
	},

	removeAllChildren: function() {
		for (var j = this.children.length - 1; j >= 0; j--) {
			if (this.isRunning()) {
				this.children[j]._exit();				
			}
			this.children[j].parent = null;
		}
		this.children = [];
		this.dirty |= 2;
		return this;
	},

	removeChild: function(o) {
		if (typeof o === 'string') {
			for (var i = 0; i < this.children.length; i++) {
				if(this.children[i].name == o) {
					var obj = this.children[i];
					this.children.splice(i, 1);
					if (this.isRunning()) {
						obj._exit();
					}
					obj.parent = null;
					break;
				}
			}
		}
		else {			
			for (var i = 0; i < this.children.length; i++) {
				if(this.children[i] == o) {
					this.children.splice(i, 1);
					if (this.isRunning()) {
						o._exit();
					}
					o.parent = null;
					break;
				}
			}
		}
		this.dirty |= 2;
		return this;
	},

	removeFromParent: function() {
		if (this.parent)
			this.parent.removeChild(this);
	},

	isRunning: function() {
		return this._director != null;
	},

	_enter: function(director) {
		this._director = director;

		if (this._events != null) {
			for (var i in this._events) {
				director._register(this, i);
			}				
		}
		if (this._msgs != null) {
			for (var type in this._msgs) {
				for (var j in this._msgs[type]) {
					if (this._msgs[type][j].fn != null) {
						le.message.listen(this, type, this._msgs[type][j].fn, this._msgs[type][j].p);
					}
				}
			}
		}

		var ta = this.children.slice(0);
		for (var i = 0, len = ta.length; i < len; i++) {
			ta[i]._enter(director);
		}
	},

	_exit: function() {
		var ta = this.children.slice(0);
		for (var i = 0, len = ta.length; i < len; i++) {
			ta[i]._exit();
		}
		if (this._msgs != null) {
			for (var type in this._msgs) {
				le.message.unlisten(this, type);
			}
		}
		if (this._events != null) {
			for (var i in this._events)
				this._director._unregister(this, i);
		}
		this._director = null;
	},

	__update: function(dt, director) {
		if (director)
			director.debugData.objs++;
		if (this._timer != null)
			this._timer._update(dt);
		if (this._actions != null) {
			var actions = this._actions;
			for (var i = 0; i < actions.length; i++) {
				if (actions[i] != null) {
					actions[i].update(dt);
					if (actions[i].isDone()) {
						actions[i].stop();
						actions.splice(i, 1);
						i--;
					}
				}
				else {
					actions.splice(i, 1);
					i--;
				}
			}
		}
		this._upnodes = this.children.slice(0);
		for (var i = 0; i < this._upnodes.length; i++) {
			if (this._upnodes[i].parent != this)
				continue;
			le.Node.prototype.__update.call(this._upnodes[i], dt, director);
			if (this._upnodes[i].dirty) {
				this.dirty |= 2;
			}
		}
	},

	draw: function(ctx) {
		
	},

	__draw: function(ctx, director, clipRect) {
		if (this.visible == false) {
			this._clearDirty();
			return;
		}
		director && director.debugData.draws++;
		if (this.scaleX != 1 || this.scaleY != 1 || this.rotation != 0) {
			ctx.save();
			ctx.translate(this.x, this.y);
			if (this.scaleX != 1 || this.scaleY != 1)
				ctx.scale(this.scaleX, this.scaleY);
			if (this.rotation != 0)
				ctx.rotate(this.rotation * Math.PI / 180);
			ctx.translate(-this.anchorX * this.w, - this.anchorY * this.h);
			clipRect = null;
		} else {
			if (clipRect !== null) {
				if (this.x - this.anchorX * this.w > clipRect.right
					|| this.y - this.anchorY * this.h > clipRect.bottom
					|| this.x + this.anchorX * this.w < clipRect.left
					|| this.y + this.anchorY * this.h < clipRect.top)  {
					this._clearDirty();
					return;
				}
			}
			ctx.save();
			ctx.translate(this.x - this.anchorX * this.w, this.y - this.anchorY * this.h);
		}
		if (this.opacity != 1)
			ctx.globalAlpha *= this.opacity;

		if (this._cacheContent & 16) {
			clipRect = {left: 0, top: 0, right: this.w, bottom: this.h};
		}
		else if (clipRect != null && (this._cacheContent & 32) ) {
			var transx = this.x - this.anchorX * this.w;
			var transy = this.y - this.anchorY * this.h;
			clipRect.left -= transx;
			clipRect.top -= transy;
			clipRect.bottom -= transy;
			clipRect.right -= transx;
		}
		else {
			clipRect = null;
		}

		if ((this.dirty & 2) > 0 && (this._cacheContent & 1) && this.w > 0 && this.h > 0) {
			var cacheMargin = this.__cacheMargin;
			if (typeof this.__cacheCanvas === 'undefined') {
				this.__cacheCanvas = this.__createCanvas(this.w + cacheMargin * 2, this.h += cacheMargin * 2);
				this.dirty |= 2;
			}
			var cacheCanvas = this.__cacheCanvas;
			var newWidth = this.w + cacheMargin * 2;
			var newHeight = this.h + cacheMargin * 2;
			if (cacheCanvas.width != newWidth || cacheCanvas.height != newHeight) {
				cacheCanvas.width = newWidth;
				cacheCanvas.height = newHeight;
			}
			else if ((this._cacheContent & 2) > 0)
				cacheCanvas.getContext('2d').clearRect(0, 0, cacheCanvas.width, cacheCanvas.height);

			var cacheCtx = cacheCanvas.getContext('2d');
			if (cacheMargin > 0)
				cacheCtx.translate(cacheMargin, cacheMargin);

			for (var i = 0, len = this.children.length; i < len; i++) {
				if (this.children[i]._zIndex >= 0)
					continue;
				le.Node.prototype.__draw.call(this.children[i], cacheCtx, director, clipRect);
			}
			this.draw(cacheCtx);
			if (this._showBorder) {
				cacheCtx.save();
				cacheCtx.strokeStyle = '#f00';
				cacheCtx.lineWidth = 1;
				cacheCtx.strokeRect(0, 0, this.w, this.h);
				cacheCtx.restore();
			}
			for (var i = 0, len = this.children.length; i < len; i++) {
				if (this.children[i]._zIndex < 0)
					continue;
				le.Node.prototype.__draw.call(this.children[i], cacheCtx, director, clipRect);
			}
		}
		if ((this._cacheContent & 1) && this.w > 0 && this.h > 0) {
			if ((this._cacheContent & (8 + 4)) == 8) {
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(0, this.h);
				ctx.lineTo(this.w, this.h);
				ctx.lineTo(this.w, 0);
				ctx.clip();
			}
			ctx.drawImage(this.__cacheCanvas, -this.__cacheMargin, -this.__cacheMargin);
		}
		else {
			for (var i = 0, len = this.children.length; i < len; i++) {
				if (this.children[i]._zIndex >= 0)
					continue;
				le.Node.prototype.__draw.call(this.children[i], ctx, director, clipRect);
			}
			if ((this._cacheContent & 8) == 8) {
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(0, this.h);
				ctx.lineTo(this.w, this.h);
				ctx.lineTo(this.w, 0);
				ctx.clip();
			}
			this.draw(ctx);
			if (this._showBorder) {
				ctx.save();
				ctx.strokeStyle = '#f00';
				ctx.lineWidth = 1;
				ctx.strokeRect(0, 0, this.w, this.h);
				ctx.restore();
			}
			for (var i = 0, len = this.children.length; i < len; i++) {
				if (this.children[i]._zIndex < 0)
					continue;
				le.Node.prototype.__draw.call(this.children[i], ctx, director, clipRect);
			}
		}
		ctx.restore();
		this.dirty = 0;
	},

	__createCanvas: function(width, height) {
		var c = document.createElement('canvas');
		c.width = width;
		c.width = height;
		return c;
	},

	setInterval: function(callback, interval, times) {
		if (this._timer == null)
			this._timer = new le.Timer();
		return this._timer.setInterval(callback, interval, times);
	},

	setTimeout: function(callback, delay) {
		if (this._timer == null)
			this._timer = new le.Timer();
		return this._timer.setTimeout(callback, delay);
	},

	clearTimer: function(id) {
		if (this._timer != null)
			this._timer.clearTimer(id);
		return this;
	},

	getParentsOrder: function() {
		var ret = [];
		var node = this;
		while (node.parent != null) {
			var i = node.parent.children.indexOf(node) + 1;
			ret.unshift(node._zIndex >= 0 ? i : -100000000 + i);
			node = node.parent;
		}
		ret.push(0);
		return ret;
	},

	convertToLocal: function(pos) {
		var route = [];
		var n = this;
		var ret = {x: pos.x, y: pos.y}
		route.unshift(n);
		while (n.parent != null) {
			route.unshift(n.parent);
			n = n.parent;
		}
		for (var i in route) {
			ret.x = ret.x - route[i].x;
			ret.y = ret.y - route[i].y;
			if (route[i].scaleX != 1) {			
				ret.x = route[i].scaleX != 0 ? ret.x/Math.abs(route[i].scaleX) : 1000000000;	
			}
			if (route[i].scaleY != 1) {
				ret.y = route[i].scaleY != 0 ? ret.y/Math.abs(route[i].scaleY) : 1000000000;
			}
			ret.x += route[i].anchorX * route[i].w;
			ret.y += route[i].anchorY * route[i].h;
		}
		return ret;
	},

	getWorldBound: function(rect) {
		rect = typeof rect === 'undefined' ? {x: 0, y: 0, w: this.w, h: this.h} : rect;
		var sp = {
			x: this.x - (this.anchorX * rect.w - rect.x) * Math.abs(this.scaleX), 
			y: this.y - (this.anchorY * rect.h - rect.y) * Math.abs(this.scaleY), 
			w: rect.w * Math.abs(this.scaleX), 
			h: rect.h * Math.abs(this.scaleY)
		};
		if (this.parent) {
			return this.parent.getWorldBound(sp);
		}
		else {
			return sp;
		}
	},

	bind: function(types, callback, m) {
		if (this._events == null)
			this._events = {};
		types = types.split(' ');
		for (var i in types) {
			if (types[i] == 'click')
				this._initClickEvent();

			if (this._events[types[i]] === undefined) {
				this._events[types[i]] = [];
			}
			this._events[types[i]].push({fn: callback, m: typeof m == 'undefined' ? 0 : m, p: 0});	
			if (this.isRunning()) {
				this._director._register(this, types[i]);
			}
		}
		return this;
	},

	unbind: function(types, callback) {
		types = types.split(' ');
		for (var i in types) {
			if (this._events[types[i]] !== undefined) {
				for (var j in this._events[types[i]]) {
					if (this._events[types[i]][j].fn === callback)
						this._events[types[i]][j].fn = null;
				}
			}
		}
		return this;
	},

	unbindAll: function(types) {

	},

	trigger: function(type, event) {
		var listeners = this._events[type];
		if (listeners) {
			for (var i = 0, len = listeners.length; i < len; i++) {
				if (listeners[i].fn == null) {
					listeners.splice(i, 1);
					i--;
					len--;
					continue;
				}
				if (type.indexOf('mouse') == 0) {
					if ((listeners[i].m & le.NOINSIDE) == 0) {
						if (this.visible == false)
							continue;
						var r = this.getWorldBound();
						if (event.x < r.x || event.y < r.y || event.x > r.x + r.w || event.y > r.y + r.h) {
							continue;
						}
					}
				}
				listeners[i].fn(event);
			}
		}
	},

	_initClickEvent: function() {
		if ('_isInitedClickEvent' in this && this._isInitedClickEvent)
			return;
		this._isInitedClickEvent = true;
		var self = this;
		var ismousedown = false;
		var isok = false;
		var startX = 0;
		var startY = 0;
		this.bind('mousedown', function(event) {
			ismousedown = true;
			isok = true;
			startX = event.x;
			startY = event.y;
		});
		this.bind('mousemove', function(event) {
			if (ismousedown) {
				if (isok) {
					if (Math.abs(startX - event.x) > 20)
						isok = false;
					if (Math.abs(startY - event.y) > 20)
						isok = false;
				}
				event.swallow();
			}
		}, le.NOINSIDE);

		this.bind('mouseup mousecancel', function(event) {
			if (ismousedown) {
				event.swallow();
				if (isok && event.type == 'mouseup') {
					self.trigger('click', new le.MouseEvent(event, event.x, event.y, 'click'));
				}
				ismousedown = false;
				isok = false;
				startX = 0;
				startY = 0;
			}
		}, le.NOINSIDE);
	},

	listen: function(typestr, callback, priority) {
		if (this._msgs == null) {
			this._msgs = {};
		}
		types = typestr.split(' ');
		for (var i in types) {
			if (this._msgs[types[i]] === undefined) {
				this._msgs[types[i]] = [];
			}
			this._msgs[types[i]].push({fn: callback, p: priority ? priority : 0});	
			if (this.isRunning()) {
				le.message.listen(this, types[i], callback, priority);
			}
		}
		return this;
	},

	unlisten: function(type, callback) {
		if (this._msgs[type] !== undefined) {
			if (callback === undefined) {
				le.message.unlisten(this, type);
			}
			else {		
				for (var j in this._msgs[type]) {
					if (this._msgs[type][j].fn === callback) {
						this._msgs[type][j].fn = null;
						if (this.isRunning()) {
							le.message.unlisten(this, type, callback);
						}
					}
				}
			}
		}
		return this;
	},

	unlistenAll: function() {
		le.message.unlisten(this);
		this._msgs = [];
	},

	runAction: function(action) {
		if (this._actions == null)
			this._actions = [];
		this._actions.push(action);
		action.start(this);
	},

	stopAction: function(action) {
		if (this._actions == null)
			return;
		for (var i = 0, len = this._actions.length; i < len; i++) {
			if (this._actions[i] == action) {
				this._actions[i].stop();
				this._actions[i] = null;
			}			
		}
	},
	
	stopAllAction: function(action) {
		for (var i = 0, len = this._actions.length; i < len; i++) {
			this._actions[i].stop();
			this._actions[i] = null;
		}
	}
});;
le.Layer = le.Node.extend({
	init: function(director) {
		le.Node.prototype.init.call(this);
		this.w = director.winSize.w;
		this.h = director.winSize.h;
	}
});

le.LayerColor = le.Node.extend({
	init: function(color, director) {
		le.Node.prototype.init.call(this);
		this.w = director.winSize.w;
		this.h = director.winSize.h;
		this.color = color;
	},

	draw: function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(0, 0, this.w, this.h);
	}
});;
le.Sprite = le.Node.extend({
	init: function(mix) {
		le.Node.prototype.init.call(this);
		this.frame = le.spriteFrameCache.get(mix);
		if (this.frame != null) {
			this.w = this.frame.sourceSize.w;
			this.h = this.frame.sourceSize.h;
		}
		this.anchorX = 0.5;
		this.anchorY = 0.5;
	},

	draw: function(ctx) {
		var frame = this.frame;
		if (frame != null) {
			ctx.drawImage(frame.image, frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, frame.spriteSourceSize.x, frame.spriteSourceSize.y, frame.spriteSourceSize.w, frame.spriteSourceSize.h);
		}
	}
});;
le.Label = le.Node.extend({
	init: function(text, font) {
		le.Node.prototype.init.call(this);
		this.text = text;
		this.font = font;
		this.lineHeight = -1;
		this.textAlign = 'left';
		this.anchorX = 0.5;
		this.anchorY = 0.5;
		this._dw = 0;
		this._dh = 0;
		this._lines = [];
		this._measure();
	},

	_measure: function() {
		var lh = this.lineHeight > 0 ? this.lineHeight : this.font.fontSize;
		var lw = this.font.fontSize;
		var ctx = le.Label._measureContext;
		ctx.save();

		this.font.beginMeasure(ctx);
		var strings = ('' + this.text).split("\n");
		this._lines = [];
		var width = 0;
		for (var i in strings) {
			if (this._dw > 0 && strings[i].length * lw > this._dw) {
				var s = strings[i];
				while (s.length > 0) {
					var res = this._divstr(ctx, s, this._dw, lw, lw * 0.6);
					this._lines.push(res.s1);
					
					s = res.s2;
					if (res.w > width)
						width = res.w;
				}
			}
			else {
				this._lines.push(strings[i]);
				var w = this.font.measure(ctx, strings[i]);
				if (w > width)
					width = w;	
			}
		}

		ctx.restore();

		this.w = width;
		this.h = lh * this._lines.length;
		if (this._dh > 0)
			this.h = this._dh;
		if (this._dw > 0)
			this.w = this._dw;
	},

	_divstr: function(ctx, s, max, lw, lweng) {
		var min = max - lweng;
		var pos = 0, len = s.length, temps = 0, steps = 0, direction = 0;
		var charl = s.charCodeAt(pos) > 127 ? lw : lweng;
		for (;pos + 1 < len;pos++) {
			if (s.charCodeAt(pos + 1) > 127) {
				if (charl + lw >= max)
					break;
				charl += lw;
			}
			else {
				if (charl + lweng >= max)
					break;
				charl += lweng;
			}
		}
		do {
			steps++;
			if (steps >= 20)
				break;
			temps = s.substr(0, pos + 1);
			charl = this.font.measure(ctx, temps);
			if (direction == -1 && charl <= max) {
				break;
			}
			else if (charl >= min && charl <= max) {
				break;
			}
			else if (charl < min) {
				if (pos >= len - 1)
					break;
				if (steps >= 3) {
					pos++;
					continue;
				}
				else {
					do {
						pos++;
						charl += s.charCodeAt(pos) > 127 ? lw : lweng;
					} while (pos < len && charl <= min)
					continue;
				}
			}
			else {
				if (pos <= 1)
					break;
				if (steps >= 3) {
					pos--;
					direction = -1;
					continue;
				}
				else {
					do {
						pos--;
						charl -= s.charCodeAt(pos) > 127 ? lw : lweng;
					} while (pos > 0 && charl > max)
					continue;
				}
			}
		} while (true);
		return {
			w: charl,
			pos: pos,
			s1: temps,
			s2: s.substr(pos + 1)
		};
	},

	setTextAlign: function(align) {
		this.textAlign = align;
		this.dirty |= 2;
		return this;
	},

	setText: function(text) {
		this.text = text;
		this.dirty |= 2;
		this._measure();
		return this;
	},

	setFont: function(font) {
		this.font = font;
		this.dirty |= 2;
		this._measure();
		return this;
	},

	setLineHeight: function(lh) {
		this.lineHeight = lh;
		this.dirty |= 2;
		this._measure();
		return this;
	},

	setDimension: function(w, h) {
		this._dw = w;
		this._dh = h;
		this.dirty |= 2;
		this._measure();
		return this;
	},

	draw: function(ctx) {
		var x = this.textAlign == 'left' ? 0 : (this.textAlign == 'right' ? this.w : this.w/2);
		var h = this.lineHeight > 0 ? this.lineHeight : this.font.fontSize;
		var y = h / 2;

		this.font.beginDraw(ctx, this.textAlign, 'middle');
		
		for (var i = 0; i < this._lines.length; i++) {
			this.font.fillText(ctx, this._lines[i], x, y);
			y += h;
		}
	}
});

le.Label._measureCanvas = document.createElement('canvas');
le.Label._measureContext = le.Label._measureCanvas.getContext('2d');;
le.Button = le.Node.extend({
	init: function(normal, pressed, disabled) {
		le.Node.prototype.init.call(this);
		this.anchorX = 0.5;
		this.anchorY = 0.5;

		this.enable = true;

		var nnormal = null, npressed = null, ndisabled = null;
		if (typeof normal == 'string')
			nnormal = new le.Sprite(normal);
		else if (normal instanceof le.Node)
			nnormal = normal;
		else
			nnormal = new le.Node();

		if (typeof pressed == 'string')
			npressed = new le.Sprite(pressed);
		else if (pressed instanceof le.Node)
			npressed = pressed;

		if (typeof disabled == 'string')
			ndisabled = new le.Sprite(disabled);
		else if (disabled instanceof le.Node)
			ndisabled = disabled;

		this.w = nnormal.w;
		this.h = nnormal.h;

		nnormal.anchorX = 0.5;
		nnormal.anchorY = 0.5;
		nnormal.x = this.w/2;
		nnormal.y = this.h/2;
		this.addChild(nnormal);
		
		if (npressed != null) {	
			npressed.anchorX = 0.5;
			npressed.anchorY = 0.5;
			npressed.x = this.w/2;
			npressed.y = this.h/2;
			npressed.setVisible(false);
			this.addChild(npressed);
		}
		if (ndisabled != null) {	
			ndisabled.anchorX = 0.5;
			ndisabled.anchorY = 0.5;
			ndisabled.x = this.w/2;
			ndisabled.y = this.h/2;
			ndisabled.setVisible(false);
			this.addChild(ndisabled);
		}
		this.normal = nnormal;
		this.pressed = npressed;
		this.disabled = ndisabled;

		this._initClickEvent();
	},

	setEnable: function(enable) {
		this.enable = enable;
		this.dirty |= 1;
		return this;
	},

	size: function(w, h) {
		this.w = w;
		this.h = h;	

		this.normal.x = this.w/2;
		this.normal.y = this.h/2;
		
		if (this.pressed != null) {		
			this.pressed.x = this.w/2;
			this.pressed.y = this.h/2;
		}
		if (this.disabled != null) {	
			this.disabled.x = this.w/2;
			this.disabled.y = this.h/2;
		}
		this.dirty |= 2;
		return this;
	},

	_initClickEvent: function() {
		if ('_isInitedClickEvent' in this && this._isInitedClickEvent)
			return;
		this._isInitedClickEvent = true;
		var self = this;
		var ismousedown = false;
		var isok = false;
		var startX = 0;
		var startY = 0;
		this.bind('mousedown', function(event) {
			ismousedown = true;
			isok = true;

			startX = event.x;
			startY = event.y;

			if (self.enable && self.pressed) {
				self.pressed.setVisible(true);
				if (self.normal)
					self.normal.setVisible(false);
			}
		});

		this.bind('mousemove', function(event) {
			if (ismousedown) {
				if (isok) {
					if (Math.abs(startX - event.x) > 20)
						isok = false;
					if (Math.abs(startY - event.y) > 20)
						isok = false;
				}
				event.swallow();
			}
		}, le.NOINSIDE);

		this.bind('mouseup mousecancel', function(event) {
			if (ismousedown) {
				event.swallow();
				if (self.enable && self.pressed) {
					self.pressed.setVisible(false);
					if (self.normal)
						self.normal.setVisible(true);
				}
				if (self.enable && isok && event.type == 'mouseup') {
					self.trigger('click', new le.MouseEvent(event, event.x, event.y, 'click'));
				}
				ismousedown = false;
				isok = false;
				startX = 0;
				startY = 0;
			}
		}, le.NOINSIDE);
	}
});;
(function(){
var Cursor = le.Node.extend({
	init: function(font) {
		le.Node.prototype.init.call(this);
		this.show = false;
		this.hide = false;
		this.font = font;
		this.w = 1;
		this.h = this.font.fontSize;

		this.clock = 0;
		var self = this;

		this.setInterval(function(dt, c) {
			if (self.show == false)
				return;
			self.clock += dt;
			var hide = (self.clock % 1200) > 600;
			if (self.hide != hide) {
				self.dirty |= 2;
				self.hide = hide;
			}
		});
	},

	startShow: function() {
		this.show = true;
		this.dirty |= 1;
		console.log('startShow');
		return this;
	},

	stopShow: function() {
		this.show = false;
		this.dirty |= 1;
		console.log('stopShow');
		return this;
	},

	draw: function(ctx) {
		if (this.show == false || this.hide)
			return;
		ctx.fillStyle = this.font.color;
		ctx.fillRect(0, 0, this.w, this.h);
	}
});

le.Input = le.Node.extend({
	init: function(font) {
		le.Node.prototype.init.call(this);
		this.label = new le.Label("", font);
		this.label.anchor(0, 0.5).pos(0, this.h/2).appendTo(this);
		this.cursor = new Cursor(font);
		this.cursor.anchor(0.5, 0.5).pos(0, this.h/2).appendTo(this);

		this.placeLabel = null;
		this.__input = null;

		var self = this;

		this.setInterval(function(dt){
			self.update(dt);
		});

		this.bind('click', function() {
			self.focus();
		});

		this.bind('mousedown', function(event){
			self.blur();
		}, le.NOINSIDE);

		this._lastX = 0;
		this._lastY = 0;
		this._lastW = 0;
		this._lastH = 0;
	},

	_enter: function(director) {
		le.Node.prototype._enter.call(this, director);
		this.__initHtml();
	},

	_exit: function() {
		this._director.container.removeChild(this.__input);
		this.__input = null;
		le.Node.prototype._exit.call(this);
	},

	__initHtml: function() {
		var input = document.createElement('input');
		input.style.position = 'absolute';
		// input.style.outline = 'none';
		// input.style.border = 'none';
		// input.style.color = 'transparent';
		input.style.width = 10;
		input.style.fontSize = this.label.font.fontSize + 'px';
		var self = this;
		input.addEventListener('blur', function(){
			self.cursor.stopShow();
		});
		input.addEventListener('focus', function(){
			self.cursor.startShow();
		});
		this._director.container.appendChild(input);
		this.__input = input;
	},

	__setHtmlPos: function(x, y, w) {
		this.__input.style.left = x;
		this.__input.style.top = y;
	},

	update: function(dt) {
		if (this.__input == null)
			return;
		if (this.label.text != this.__input.value) {
			this.label.setText(this.__input.value);
			this.cursor.posX(this.label.w);
			if (this.label.w > this.w) {
				this.size(this.label.w, this.h);
			}
		}
		if (this._lastH != this.h) {
			this.label.posY(this.h/2);
			this.cursor.posY(this.h/2);
		}
		if (this._lastW != this.w || this._lastH != this.h || this._lastX != this.x || this._lastY != this.y) {
			var bottom = this.h / 2 + this.label.h/2;
			var rect = this.getWorldBound({x: 0, y: bottom, w: this.w, h: this.h - bottom});
			var winScale = this._director.winScale;
			this.__setHtmlPos(rect.x * winScale.sx, rect.y * winScale.sy, rect.w * winScale.sx);

			this._lastW = this.w;
			this._lastX = this.x;
			this._lastY = this.y;
			this._lastH = this.h;
		}
	},

	setPlaceholder: function(text, font) {
		if (this.placeLabel)
			this.removeChild(this.placeLabel);
		this.placeLabel = new le.Label(text, font);
		this.dirty |= 2;
	},

	setText: function(text) {
		this.label.setText(text);
	},

	focus: function() {
		this.__input.focus();
		this.__input.value = this.label.text;
		this.cursor.startShow();
	},

	blur: function() {
		this.__input.blur();
		this.cursor.stopShow();
	}
});
})();;
le.Video = le.Node.extend({
	init: function(source) {
		le.Node.prototype.init.call(this);
		this.source = source;
		this.__video = null;

		var self = this;

		this.setInterval(function(dt){
			self.update(dt);
		}, 1/30);
	},

	__initHtml: function() {
		var video = document.createElement('video');
		video.src = this.source;

		video.style.position = 'absolute';
		video.style.width = 320;
		video.style.height = 100;
		video.style.left = '100px';
		video.style.top = '100px';
		var self = this;
		// video.addEventListener('blur', function(){
		// });
		// video.addEventListener('focus', function(){
		// });
		this._director.container.appendChild(video);
		this.__video = video;
	},

	_enter: function(director) {
		le.Node.prototype._enter.call(this, director);
		this.__initHtml();
	},

	_exit: function() {
		this._director.container.removeChild(this.__video);
		this.__video = null;
		le.Node.prototype._exit.call(this);
	},

	play: function() {
		if (this.__video != null) {
			this.__video.play();
		}
	},

	pause: function() {
		if (this.__video != null)
			this.__video.pause();
	},

	update: function(dt) {
		this.dirty |= 2;
	},

	draw: function(ctx) {
		if (this.__video) {
			ctx.drawImage(this.__video, 0, 0, this.w, this.h);
		}
	}
});;
le.Scene = Object.extend({
	init: function() {
		this._indent = {};
		this._data = {};
		this.root = null;
		this._status = 'INITED';
		this._from = 'PUSH_IN';
		this._todoTasks = 0;
		this.director = null;
	},

	setIntent: function(key, value) {
		this._indent[key] = value;
	},

	getIntent: function(key) {
		return this._indent[key];
	},

	etData: function(key, value) {
		this._data[key] = value;
	},

	getData: function(key) {
		return this._data[key];
	},

	_doStart: function(director, parent) {
		this.director = director;
		if (this.root != null) {
			this.root.removeFromParent();
		}
		this.root = new le.Layer(this.director);
		this.root.bind('mouseup mousedown mousemove mousecancel', function(event) {
			event.swallow();
		});
		parent.addChild(this.root);
		this._status = 'LOADING';
		this.incTask();

		var self = this;
		le.step.add(function(){
			self.willLoad();	
		}).add(function(){
			self.decTask();
		});
	},

	_doFinish: function() {
		if (this._status == 'FINISHED' || this._status == 'FINISHING') {
			return;
		}
		this._status = 'FINISHING';
		var self = this;
		le.step.add(function() {
			if (self._status == 'FINISHING')
				self.willExit();
		}).add(function() {
			if (self._status != 'FINISHING')
				return;
			if (self.root != null) {
				self.root.removeFromParent();
				self.root = null;
			}
			this._status = 'FINISHED';
			self.didExit();
		});
	},

	incTask: function() {
		this._todoTasks++;
	},

	decTask: function() {
		this._todoTasks--;
		while (this._todoTasks <= 0 && this._status == 'LOADING') {
			var self = this;
			this._status = 'LOADED';
			le.step.add(function(){
				if (self._status == 'LOADED')
					self.didLoad();
			})
			.add(function(){
				if (self._status == 'LOADED') {
					self.willEnter();	
					self._status = 'RUNNING';
				}
			})
			.add(function(){
				if (self._status == 'RUNNING') {
					self.didEnter();
				}
			});
		}
	},

	finish: function() {
		if (this.director != null) {
			this.director.finishScene(this);
		}
		else {
			le.director.reportError('finish with no start');
		}
	},

	finishWithResult: function() {

	},

	willLoad: function() {

	},

	didLoad: function() {

	},

	willEnter: function() {

	},

	didEnter: function() {

	},

	willExit: function() {

	},

	didExit: function() {

	}
});;
le.Action = Object.extend({
	init: function() {
	
	},

	isRunning: function() {
		return false;
	}
});
le.ActionInterval = le.Action.extend({
	init: function(duration) {
		this.duration = duration;
		this.clock = 0;
		this.target = null;
		this.fc = true;
	},

	getDuration: function() {
		return this.duration;
	},

	start: function(target) {
		this.target = target;
		this.clock = 0;
		this.fc = true;
	},

	isDone: function() {
		return this.clock >= this.duration;
	},

	stop: function() {
		this.target = null;
	},

	isRunning: function() {
		return this.target != null;
	},

	update: function(dt) {
		if (this.target == null)
			return;
		if (this.fc) {
			this.fc = false;
			this.clock = 0;
		}
		else {
			this.clock += dt;
		}
		if (this.duration > 0) {
			var p = this.clock / this.duration;
			if (p > 1)
				p = 1;
			else if (p < 0)
				p = 0;
			this.step(p);
		}
		else {
			this.step(this.clock > 0 ? 1 : 0);
		}
	},

	step: function(percent) {

	}
});

var ActionInterval = le.ActionInterval;
var ActionIntervalInit = ActionInterval.prototype.init;
var ActionIntervalStart = ActionInterval.prototype.start;

le.ActionEasy = ActionInterval.extend({
	init: function(action) {
		ActionIntervalInit.call(this, action.duration);
		this.inner = action;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.inner.start(this.target);
	},

	stop: function() {
		ActionInterval.prototype.stop.call(this);
		this.inner.stop();
	},

	step: function(percent) {
		this.inner.step(percent);
	}
});

le.Seq = ActionInterval.extend({
	init: function(arg) {
		var actions = arg instanceof Array ? arg : Array.prototype.slice.call(arguments, 0);
		var d = 0;
		for (var i = 0, len = actions.length; i < len; i++) {
			d += actions[i].duration;
		}
		ActionIntervalInit.call(this, d);
		this._actions = actions;
		this._last = -1;
		this.ld = 0;
		this.fc = true;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this._last = -1;
		this.ld = 0;
		this.fc = true;
	},

	stop: function() {
		if (this._last != -1) {
			this._actions[this._last].stop();
		}
		ActionInterval.prototype.stop.call(this);
	},

	update: function(dt) {
		var actions = this._actions, last = this._last;
		if (this.fc) {
			this.fc = false;
			this.clock = 0;
			this.ld = 0;
			if (actions.length > 0) {
				actions[0].start(this.target);
				actions[0].update(0);
				last = 0;
			}
			else {
				return;
			}
		}
		else {
			this.clock += dt;
			this.ld += dt;
			if (last != -1) {
				actions[last].update(dt);
			}
		}

		while (last != -1) {
			if (actions[last].isDone() == false) {
				break;
			}
			actions[last].stop();
			if (last + 1 >= actions.length) {
				last = -1;
				break;
			}
			this.ld -= actions[last].duration;
			last++;
			actions[last].start(this.target);
			actions[last].update(0);
			if (this.ld > 0) {
				if (actions[last].isDone())
					continue;
				actions[last].update(this.ld);
			}
		}
		this._last = last;
	}
});

le.Spwan = ActionInterval.extend({
	init: function(arg) {
		var actions = arg instanceof Array ? arg : Array.prototype.slice.call(arguments, 0);
		var d = 0;
		for (var i = 0, len = actions.length; i < len; i++) {
			if (actions[i].duration > d)
				d = actions[i].duration;
		}
		this._actions = actions;
		ActionIntervalInit.call(this, d);
	},

	update: function(dt) {
		if (this.fc) {
			this.fc = false;
			this.clock = 0;
		}
		else {
			this.clock += dt;
		}
		var actions = this._actions; 
		for (var i = 0, len = actions.length; i < len; i++) {
			if (actions[i].isRunning() == false) {
				continue;
			} 
			actions[i].update(dt);
			if (actions[i].isDone()) {
				actions[i].stop();
			}
		}
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		for (var i = 0, len = this._actions.length; i < len; i++) {
			this._actions[i].start(target);
		}
	}
});

le.RepeatForever = ActionInterval.extend({
	init: function(action) {
		ActionIntervalInit.call(this, action.duration);
		this._inner = action;
		this.ld = 0;
	},

	isDone: function() {
		return false;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this._inner.start(target);
		this.ld = 0;
	},	

	update: function(dt) {
		var inner = this._inner;
		if (this.fc) {
			this.fc = false;
			this.clock = 0;
			this.ld = 0;
			dt = 0;
			inner.start(this.target);
			inner.update(0);
		}
		else {
			this.clock += dt;
			this.ld += dt;
			inner.update(dt);
		}
		if (inner.isDone()) {
			inner.stop();
			inner.start(this.target);
			inner.update(0);
			this.ld = this.ld - this.duration;
			if (this.ld > 0 && inner.isDone() == false)
				inner.update(this.ld);
		}
	}
});

le.MoveBy = ActionInterval.extend({
	init: function(duration, x, y) {
		ActionIntervalInit.call(this, duration);
		this.dx = x;
		this.dy = y;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
		this.y = target.y;
	},

	step: function(percent) {
		this.target.pos(this.x + this.dx * percent, this.y + this.dy * percent);
	}
});

le.MoveTo = ActionInterval.extend({
	init: function(duration, x, y) {
		ActionIntervalInit.call(this, duration);
		this.dx = x;
		this.dy = y;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
		this.y = target.y;
		this.dx = this.dx - this.x;
		this.dy = this.dy - this.y;
	},

	step: function(percent) {
		this.target.pos(this.x + this.dx * percent, this.y + this.dy * percent);
	}
});

le.MoveXBy = ActionInterval.extend({
	init: function(duration, x) {
		ActionIntervalInit.call(this, duration);
		this.dx = x;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
	},

	step: function(percent) {
		this.target.posX(this.x + this.dx * percent);
	}
});

le.MoveXTo = ActionInterval.extend({
	init: function(duration, x) {
		ActionIntervalInit.call(this, duration);
		this.dx = x;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
		this.dx = this.dx - this.x;
	},

	step: function(percent) {
		this.target.posX(this.x + this.dx * percent);
	}
});

le.MoveYBy = ActionInterval.extend({
	init: function(duration, y) {
		ActionIntervalInit.call(this, duration);
		this.dy = y;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.y = target.y;
	},

	step: function(percent) {
		this.target.posY(this.y + this.dy * percent);
	}
});

le.MoveYTo = ActionInterval.extend({
	init: function(duration, x) {
		ActionIntervalInit.call(this, duration);
		this.dy = y;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.y = target.y;
		this.dy = this.dy - this.y;
	},

	step: function(percent) {
		this.target.posY(this.y + this.dy * percent);
	}
});

le.ScaleBy = ActionInterval.extend({
	init: function(duration, scaleX, scaleY) {
		ActionIntervalInit.call(this, duration);
		this.dsx = scaleX;
		this.dsy = typeof scaleY == 'undefined' ? scaleX : scaleY;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.sx = target.scaleX;
		this.sy = target.scaleY;
		this.dsx = this.dsx * this.sx - this.sx;
		this.dsy = this.dsy * this.sy - this.sy;
	},

	step: function(percent) {
		this.target.scale(this.sx + this.dsx * percent, this.sy + this.dsy * percent);
	}
});

le.ScaleTo = ActionInterval.extend({
	init: function(duration, scaleX, scaleY) {
		ActionIntervalInit.call(this, duration);
		this.dsx = scaleX;
		this.dsy = typeof scaleY == 'undefined' ? scaleX : scaleY;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.sx = target.scaleX;
		this.sy = target.scaleY;
		this.dsx = this.dsx - this.sx;
		this.dsy = this.dsy - this.sy;
	},

	step: function(percent) {
		this.target.scale(this.sx + this.dsx * percent, this.sy + this.dsy * percent);
	}
});

le.RotateTo = ActionInterval.extend({
	init: function(duration, angle) {
		ActionIntervalInit.call(this, duration);
		this.dag = angle;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.ag = target.rotation % 360;
		this.dag = this.dag - this.ag;
		if (this.dag > 180)
			this.dag -= 360;
		else if (this.dag < -180)
			this.dag += 360;
	},

	step: function(percent) {
		this.target.setRotation(this.ag + this.dag * percent);
	}
});

le.RotateBy = ActionInterval.extend({
	init: function(duration, angle) {
		ActionIntervalInit.call(this, duration);
		this.dag = angle;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.ag = target.rotation;
	},

	step: function(percent) {
		this.target.setRotation(this.ag + this.dag * percent);
	}
});

le.JumpBy = ActionInterval.extend({
	init: function(duration, x, y, h, jumps) {
		ActionIntervalInit.call(this, duration);
        this.dx = x;
		this.dy = y;
        this.h = -h;
        this.jumps = jumps;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
		this.y = target.y;
	},

	step: function(percent) {
		var frac = (percent * this.jumps) % 1;
        var y = this.h * 4 * frac * (1 - frac);
        y += this.dy * percent;
        this.target.pos(this.dx * percent + this.x, this.y + y);
	}
});

le.JumpTo = le.JumpBy.extend({
	init: function(duration, x, y, h, jumps) {
		le.JumpBy.prototype.init.call(this, duration, x, y, h, jumps);
	},

	start: function(target) {
		le.JumpBy.prototype.start.call(this, target);
		this.dx = this.dx - this.x;
		this.dy = this.dy - this.y;
	}
});

le.Blink = ActionInterval.extend({
	init: function(duration, times) {
		ActionIntervalInit.call(this, duration);
		this.times = times;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.origin = target.visible;
	},

	stop: function() {
		this.target.setVisible(this.origin);
		ActionInterval.prototype.stop.call(this);
	},

	step: function(percent) {
		var slice = 1 / this.times;
		var m = percent % slice;
		this.target.setVisible(m > slice / 2 ? true : false);
	}
});

le.Delay = ActionInterval.extend({
});

le.FadeTo = ActionInterval.extend({
	init: function(duration, opa) {
		ActionIntervalInit.call(this, duration);
		this.dopa = opa;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.opa = target.opacity;
		this.dopa = this.dopa - this.opa;
	},

	step: function(percent) {
		this.target.setOpacity(this.opa + this.dopa * percent);
	}
});;
le.ActionInstant = le.Action.extend({
	init: function() {
		this.target = null;
		this.clock = 0;
		this.duration = 0;
	},

	start: function(target) {
		this.target = target;
		this.clock = 0;
	},

	isDone: function() {
		return true;
	},

	stop: function() {
		this.target = null;
	},

	isRunning: function() {
		return this.target != null;
	},

	update: function(dt) {
	},

	step: function(percent) {}
});
var ActionInstant = le.ActionInstant;
le.Show = ActionInstant.extend({
	update: function(dt) {
		this.target.setVisible(true);
	}
});

le.Hide = ActionInstant.extend({
	update: function(dt) {
		this.target.setVisible(false);
	}
});

le.Place = ActionInstant.extend({
	init: function(x, y) {
		ActionInstant.prototype.init.call(this);
		this.x = x;
		this.y = y;
	},

	update: function(dt) {
		this.target.pos(this.x, this.y);
	}
});

le.Callfunc = ActionInstant.extend({
	init: function(func) {
		ActionInstant.prototype.init.call(this);
		this.func = func;
	},

	update: function(dt) {
		this.func.call(this.target);
	}
});

le.RemoveSelf = ActionInstant.extend({
	update: function(dt) {
		this.target.removeFromParent();
	}
});;
var ActionEasy = le.ActionEasy;
var ActionEasyInit = le.ActionEasy.prototype.init;
le.EasyIn = ActionEasy.extend({
	init: function(action, rate) {
		ActionEasyInit.call(this, action);
		this.rate = typeof rate == 'undefined' ? 2 : rate;
	},

	step: function(percent) {
		this.inner.step(Math.pow(percent, this.rate));
	}
});

le.EasyOut = ActionEasy.extend({
	init: function(action, rate) {
		ActionEasyInit.call(this, action);
		this.rate = typeof rate == 'undefined' ? 2 : rate;
	},

	step: function(percent) {
		this.inner.step(Math.pow(percent, 1/this.rate));
	}
});

le.EasyInOut = ActionEasy.extend({
	init: function(action, rate) {
		ActionEasyInit.call(this, action);
		this.rate = typeof rate == 'undefined' ? 2 : rate;
	},

	step: function(percent) {
		percent *= 2;
		if (percent < 1) {
			this.inner.step(0.5 * Math.pow(percent, this.rate));
		}
	    else {
			this.inner.step(1 - 0.5 * Math.pow(2 - percent, this.rate));
		}
	}
});

le.EaseExponentialIn = ActionEasy.extend({
	step: function(percent) {
		percent = (percent == 0 ? 0 : Math.pow(2, 10 * (percent/1 - 1)) - 1 * 0.001);
		this.inner.step(percent);
	}
});

le.EaseExponentialOut = ActionEasy.extend({
	step: function(percent) {
		percent = (percent == 1 ? 1 : (-Math.pow(2, -10 * percent / 1) + 1));
		this.inner.step(percent);
	}
});
le.EaseExponentialInOut = ActionEasy.extend({
	step: function(percent) {
		percent /= 0.5;
	    if (percent < 1)
	        percent = 0.5 * Math.pow(2, 10 * (percent - 1));
	    else
	        percent = 0.5 * (-Math.pow(2, -10 * (percent - 1)) + 2);
		this.inner.step(percent);
	}
});

le.EaseSineIn = ActionEasy.extend({
	step: function(percent) {
		percent = -1 * Math.cos(percent * Math.PI/2) + 1;
		this.inner.step(percent);
	}
});
le.EaseSineOut = ActionEasy.extend({
	step: function(percent) {
		percent = Math.sin(percent * Math.PI/2);
		this.inner.step(percent);
	}
});
le.EaseSineInOut = ActionEasy.extend({
	step: function(percent) {
		percent = -0.5 * (Math.cos(percent * Math.PI) - 1)
		this.inner.step(percent);
	}
});
le.EaseElasticIn = ActionEasy.extend({
	init: function(action, period) {
		ActionEasyInit.call(this, action);
		this.period = typeof period == 'undefined' ? 0.3 : period;
	},

	step: function(percent) {
		var newT = 0;
	    if (percent == 0 || percent == 1)
			newT = percent;
	    else {
	    	var s = this.period / 4;
	        percent = percent - 1;
	        newT = - Math.pow(2, 10 * percent) * Math.sin((percent - s) * Math.PI/ 2 / this.period);
	    }
		this.inner.step(newT);
	}
});
le.EaseElasticOut = ActionEasy.extend({
	init: function(action, period) {
		ActionEasyInit.call(this, action);
		this.period = typeof period == 'undefined' ? 0.3 : period;
	},

	step: function(percent) {
		var newT = 0;
		if (percent == 0 || percent == 1)
			newT = percent;
		else {			
			var s = this.period / 4;
			newT = Math.pow(2, -10 * percent) * Math.sin((percent - s) * Math.PI / 2 / this.period) + 1;
		}
		this.inner.step(newT);
	}
});
le.EaseElasticInOut = ActionEasy.extend({
	init: function(action, period) {
		ActionEasyInit.call(this, action);
		this.period = typeof period == 'undefined' ? 0.3 : period / 1000;
	},

	step: function(percent) {
		var newT = 0;
		if (percent == 0 || percent == 1)
			newT = percent;
		else
		{
			percent = percent * 2;
			if (!this.period)
				this.period = 0.3 * 1.5;

			var s = this.period / 4;

			percent = percent - 1;
			if (percent < 0) {
				newT = -0.5 * Math.pow(2, 10 * percent) * Math.sin((percent -s) * Math.PI / 2 / this.period);
			}
			else {
				newT = Math.pow(2, -10 * percent) * Math.sin((percent - s) * Math.PI / 2 / this.period) * 0.5 + 1;
			}
		}
		this.inner.step(newT);
	}
});
(function(){
function bounceTime(time) {
	if (time < 1 / 2.75) {
		return 7.5625 * time * time;
    }
	else if (time < 2 / 2.75) {
		time -= 1.5 / 2.75;
		return 7.5625 * time * time + 0.75;
	}
	else if(time < 2.5 / 2.75) {
		time -= 2.25 / 2.75;
		return 7.5625 * time * time + 0.9375;
	}
	time -= 2.625 / 2.75;
    return 7.5625 * time * time + 0.984375;
}

le.BounceEaseIn = ActionEasy.extend({
	init: function(action) {
		ActionEasyInit.call(this, action);
		this.period = typeof period == 'undefined' ? 0.3 : period / 1000;
	},

	step: function(percent) {
		this.inner.step(1 - bounceTime(1 - percent));
	}
});
le.BounceEaseOut = ActionEasy.extend({
	step: function(percent) {
		this.inner.step(bounceTime(percent));
	}
});
le.BounceEaseInOut = ActionEasy.extend({
	step: function(percent) {
		var newT = 0;
		if (percent < 0.5) {
			percent = percent * 2;
			newT = (1 - bounceTime(1 - percent)) * 0.5;
		}
		else {
			newT = bounceTime(percent * 2 - 1) * 0.5 + 0.5;
		}
		this.inner.step(newT);
	}
});
})();

le.BackEaseIn = ActionEasy.extend({
	step: function(percent) {
		this.inner.step(percent * percent * ((1.70158 + 1) * percent - 1.70158));
	}
});

le.BackEaseOut = ActionEasy.extend({
	step: function(percent) {
		percent = percent - 1;
		this.inner.step(percent * percent * ((1.70158 + 1) * percent + 1.70158) + 1);
	}
});

le.BackEaseInOut = ActionEasy.extend({
	step: function(percent) {
		var newT = 0;
		var overshoot = 1.70158 * 1.525;

		percent = percent * 2;
		if (percent < 1) {
			newT = (percent * percent * ((overshoot + 1) * percent - overshoot)) / 2;
		}
		else {
			percent = percent - 2;
			newT = (percent * percent * ((overshoot + 1) * percent + overshoot)) / 2 + 1;
		}

		this.inner.step(newT);
	}
});;
le.MouseEvent = function(event, x, y, type) {
	this.orign = event;
	this.type = type;
	this.x = x;
	this.y = y;
	this.swallowed = false;
};

le.MouseEvent.prototype.swallow = function() {
	this.swallowed = true;
};;
le.KeyboardEvent = function(event, key, keyCode, type) {
	this.orign = event;
	this.type = type;
	this.keyCode = keyCode;
	this.charCode = event.charCode;
	this.key = key;
	this.altKey = event.altKey;
	this.shiftKey = event.shiftKey;
	this.ctrlKey = event.ctrlKey;
	this.swallowed = false;
};

le.KeyboardEvent.prototype.swallow = function() {
	this.swallowed = true;
};;
le.DebugFps = le.Node.extend({
	init:  function(director) {
		le.Node.prototype.init.call(this);
		this.anchor(0).size(160, 42);
		this.font = new le.Sysfont('microsoft yahei', 12, '#FFF');
		this.director = director;
	},
	draw: function(ctx) {
		ctx.fillStyle = 'rgba(0, 0, 0)';
		ctx.fillRect(0, 0, this.w, this.h);
		var debugData = this.director.debugData;

		this.font.beginDraw(ctx, 'left', 'middle');

		this.font.fillText(ctx, 'udt: ' + debugData.updateTime.toFixed(2), 0, 7);
		this.font.fillText(ctx, 'draw: ' + debugData.drawTime.toFixed(2), 0, 21);
		this.font.fillText(ctx, 'objs: ' + debugData.objs, 0, 35);
		this.font.fillText(ctx, 'draws: ' + debugData.draws, 90, 35);
		this.font.fillText(ctx, 'fps: ' + debugData.fps, 90, 7);
		this.font.fillText(ctx, 'dfps: ' + debugData.drawFps, 90, 21);
	}
});;
})(window, window.le);