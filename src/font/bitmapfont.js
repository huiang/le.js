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
});