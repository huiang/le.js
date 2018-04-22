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
})();