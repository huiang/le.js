le.SpriteFrame = Object.extend({
	init: function(image, sets) {
		this.image = image;
		this.frame = sets.frame;
		this.rotated = sets.rotated;
		this.spriteSourceSize = sets.spriteSourceSize;
		this.sourceSize = sets.sourceSize;

		//scale
		//this.spriteSourceSize.x = this.spriteSourceSize.x * scale;
		//this.spriteSourceSize.y = this.spriteSourceSize.y * scale;
		//this.spriteSourceSize.w = this.spriteSourceSize.w * scale;
		//this.spriteSourceSize.h = this.spriteSourceSize.h * scale;
		//this.sourceSize.w = this.sourceSize.w * scale;
		//this.sourceSize.h = this.sourceSize.w * scale;
	}
});