(function(){
	le.spriteFrameCache = (function() {
		var api = {};

		var list = {};

		api.add = function(image, mix) {
			if (typeof mix == 'string') {
				list[mix] = new le.SpriteFrame(image, {
					frame: {"x":0, "y":0, "w":image.width, "h": image.height},
					rotated: false,
					trimmed: false,
					spriteSourceSize: {"x":0, "y":0, "w":image.width, "h": image.height},
					sourceSize: {"w":image.width, "h": image.height}
				});
			}
			else if (typeof mix == 'object') {
				for (var i in mix.frames) {
					list[i] = new le.SpriteFrame(image, mix.frames[i]);
				}
			}
		};

		api.get = function(name) {
			if (name in list)
				return list[name];
			else
				return null;
		};
		return api;
	})();
})();