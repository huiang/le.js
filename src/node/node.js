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
				if (actions[i] != null && actions[i].isRunning()) {
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
			cacheCtx.save();
			this.draw(cacheCtx);
			cacheCtx.restore();
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
			ctx.save();
			this.draw(ctx);
			ctx.restore();
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
			x: this.x - (this.anchorX * this.w - rect.x) * Math.abs(this.scaleX), 
			y: this.y - (this.anchorY * this.h - rect.y) * Math.abs(this.scaleY), 
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
	
	stopAllAction: function() {
		if (this._actions == null)
			return;
		for (var i = 0, len = this._actions.length; i < len; i++) {
			this._actions[i].stop();
			this._actions[i] = null;
		}
	}
});