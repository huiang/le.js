le.RectColor = le.Node.extend({
	init: function(color) {
		le.Node.prototype.init.call(this);
		this.color = color;
		this.anchor(0.5, 0.5);
	},

	setColor: function(color) {
		this.color = color;
		this.contentDirty();
	},

	setRadius: function(tl, tr, bl, br) {
		if (tr == undefined) {
			tr = bl = br = tl;
		}
		this.tr = tr;
		this.bl = bl;
		this.br = br;
		this.tl = tl;
		this.contentDirty();
		return this;
	},

	draw: function(ctx) {
		if (this.tr != undefined) {
			ctx.fillStyle = this.color;
			ctx.fillRect(0, 0, this.w, this.h);
		}
		else {		
			ctx.fillStyle = this.color;
			ctx.fillRect(0, 0, this.w, this.h);	
		}

		return this;
	}
});