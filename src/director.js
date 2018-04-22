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
			w: null,
			h: null
		};
		this.designResolution = 'SHOW_ALL';

		func.call(this, cwidth, cheight);

		if (this.winSize.w == null) {
			this.winSize.w = this.containerSize.w;
			this.winSize.h = this.containerSize.h;
		}

		this.winScale = {
			sx: this.containerSize.w / this.winSize.w,
			sy: this.containerSize.h / this.winSize.h
		};
		this._zoomFactor = 1;

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
		this._eventEnable = true;
		this.initEvent();
	},

	setEventEnable: function(enable) {
		this._eventEnable = enable;
	},

	setZoomFactor: function(zoom) {
		this._zoomFactor = zoom;
	},

	setContainerSize: function(width, height) {
		this.containerSize.w = width;
		this.containerSize.h = height;
	},

	setDesignResolutionSize: function(width, height, method) {
		this.winSize.w = width;
		this.winSize.h = height;
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
	    	{'type':'mouseup', 'value':['mouseup', 'touchend']},
	    	{'type':'mousemove', 'value':['mousemove', 'touchmove']},
	    	{'type':'mousedown', 'value':['mousedown', 'touchstart']},
	    	{'type':'mousecancel', 'value':['mouseout', 'touchcancel']},
	    	{'type':'click', 'value':['click']}
	    ];
	    eventsMap.forEach(function(x) {
	    	x.value.forEach(function(es){
			    self.canvas.addEventListener(es, function(event){
			    	if (self._eventEnable == false) {
			    		return;
			    	}
			    	event.preventDefault();
			    	event.stopPropagation();
			    	if (x.type == 'click') {
			    		return;
			    	}
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
					var ev = new le.MouseEvent(event, (event, clientX/self._zoomFactor - rect.left) * self.winSize.w  / rect.width, (clientY/self._zoomFactor - rect.top) * self.winSize.h / rect.height, x.type);
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
			le.reportError('sortWithGlobalZorder error.');
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
});