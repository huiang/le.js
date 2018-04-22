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
le.Label._measureContext = le.Label._measureCanvas.getContext('2d');