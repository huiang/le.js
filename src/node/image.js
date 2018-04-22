le.Image = le.Node.extend({
	init: function(src) {
		le.Node.prototype.init.call(this);
		this.anchorX = 0.5;
		this.anchorY = 0.5;
		this.src = src;
		this.image = new Image();
		this.status = 0;
		this._autoSize = true;
		var self = this;
		this.image.onload = function() {
			self.status = 1;
			self.contentDirty();
			if (self._autoSize) {
				le.Node.prototype.size.call(self, self.image.width, self.image.height);
			}
		};
		this.image.onerror = function() {
			self.status = -1;
			le.reportError("error image: " + self.src);
		};	
		this.image.src = src;
	},

	size: function(w, h) {
		le.Node.prototype.size.call(this, w, h);
		this._autoSize = false;
		return this;
	},

	draw: function(ctx) {
		if (this.status > 0) {
			ctx.drawImage(this.image, 0, 0, this.w, this.h);
		}
	}
});