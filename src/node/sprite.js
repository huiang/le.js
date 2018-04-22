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
});