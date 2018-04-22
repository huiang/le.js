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
});