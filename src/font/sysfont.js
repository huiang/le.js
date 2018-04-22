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
});