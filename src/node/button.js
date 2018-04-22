le.Button = le.Node.extend({
	init: function(normal, pressed, hover, disabled) {
		le.Node.prototype.init.call(this);
		this.anchorX = 0.5;
		this.anchorY = 0.5;

		this.enable = true;

		var nnormal = null, npressed = null, ndisabled = null, nhover = null;
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

		if (typeof hover == 'string')
			nhover = new le.Sprite(hover);
		else if (hover instanceof le.Node)
			nhover = hover;

		if (typeof disabled == 'string')
			ndisabled = new le.Sprite(disabled);
		else if (disabled instanceof le.Node)
			ndisabled = disabled;

		this.w = nnormal.w;
		this.h = nnormal.h;

		nnormal.anchor(0.5, 0.5);
		nnormal.pos(this.w / 2, this.h / 2);
		this.addChild(nnormal);
		
		if (npressed != null) {
			npressed.anchor(0.5, 0.5);
			npressed.pos(this.w / 2, this.h / 2);
			npressed.setVisible(false);
			this.addChild(npressed);
		}
		if (nhover != null) {
			nhover.anchor(0.5, 0.5);
			nhover.pos(this.w / 2, this.h / 2);
			nhover.setVisible(false);
			this.addChild(nhover);
		}
		if (ndisabled != null) {
			ndisabled.anchor(0.5, 0.5);
			ndisabled.pos(this.w / 2, this.h / 2);
			ndisabled.setVisible(false);
			this.addChild(ndisabled);
		}
		this.normal = nnormal;
		this.hover = nhover || nnormal;
		this.pressed = npressed || nhover || nnormal;
		this.disabled = ndisabled || nnormal;

		this.ismousedown = false;
		this.ismousein = false;
		this.isok = false;
		this._initClickEvent();
	},

	_show: function(show) {
		if (this[show]) {
			this.normal.setVisible(false);
			this.hover.setVisible(false);
			this.pressed.setVisible(false);
			this.disabled.setVisible(false);
			this[show].setVisible(true);
			this.dirty |= 1;
		}
	},

	setEnable: function(enable) {
		if (this.enable != enable) {
			this._show(enable ? 'normal' : 'disabled');
		}
		this.enable = enable;
		return this;
	},

	size: function(w, h) {
		this.w = w;
		this.h = h;	

		this.normal.pos(this.w/2, this.h/2);
		
		if (this.pressed != null) {
			this.pressed.pos(this.w/2, this.h/2);
		}
		if (this.disabled != null) {	
			this.disabled.pos(this.w/2, this.h/2);
		}
		this.dirty |= 2;
		return this;
	},

	_initClickEvent: function() {
		if ('_isInitedClickEvent' in this && this._isInitedClickEvent)
			return;
		this._isInitedClickEvent = true;
		var self = this;
		var startX = 0;
		var startY = 0;
		this.bind('mousedown', function(event) {
			if (self.enable == false) {
				return;
			}
			self.ismousedown = true;
			self.isok = true;

			startX = event.x;
			startY = event.y;

			self._show('pressed');
		});

		this.bind('mousemove', function(event) {
			if (self.enable == false) {
				return;
			}
			if (self.ismousedown) {
				if (self.isok) {
					if (Math.abs(startX - event.x) > 20)
						self.isok = false;
					if (Math.abs(startY - event.y) > 20)
						self.isok = false;
				}
				event.swallow();
			}
			else if (self.hover != self.normal) {
				var isin = false;
				var r = self.getWorldBound();
				if (event.x < r.x || event.y < r.y || event.x > r.x + r.w || event.y > r.y + r.h) {
					isin = false;
				}
				else {
					isin = true;
				}
				if (isin != self.ismousein) {
					self.ismousein = isin;
					if (self.ismousedown == false) {
						self._show(isin ? 'hover' : 'normal');
					}
				}
			}
		}, le.NOINSIDE);

		this.bind('mouseup mousecancel', function(event) {
			if (self.enable == false) {
				return;
			}
			if (self.ismousedown) {
				event.swallow();
				if (self.isok && event.type == 'mouseup') {
					self.trigger('click', new le.MouseEvent(event, event.x, event.y, 'click'));
				}
			}
			self.ismousedown = false;
			self.isok = false;
			startX = 0;
			startY = 0;
			if (self.enable == false) {
				return;
			}
			if (event.type == 'mousecancel') {
				self._show('normal');
			}
			else {
				self._show(self.ismousein ? 'hover' : 'normal');
			}
		}, le.NOINSIDE);
	}
});