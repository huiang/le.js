le.Video = le.Node.extend({
	init: function(source) {
		le.Node.prototype.init.call(this);
		this.source = source;
		this.__video = null;

		var self = this;

		this.setInterval(function(dt){
			self.update(dt);
		}, 1/30);
	},

	__initHtml: function() {
		var video = document.createElement('video');
		video.src = this.source;

		video.style.position = 'absolute';
		video.style.width = 320;
		video.style.height = 100;
		video.style.left = '100px';
		video.style.top = '100px';
		var self = this;
		// video.addEventListener('blur', function(){
		// });
		// video.addEventListener('focus', function(){
		// });
		this._director.container.appendChild(video);
		this.__video = video;
	},

	_enter: function(director) {
		le.Node.prototype._enter.call(this, director);
		this.__initHtml();
	},

	_exit: function() {
		this._director.container.removeChild(this.__video);
		this.__video = null;
		le.Node.prototype._exit.call(this);
	},

	play: function() {
		if (this.__video != null) {
			this.__video.play();
		}
	},

	pause: function() {
		if (this.__video != null)
			this.__video.pause();
	},

	update: function(dt) {
		this.dirty |= 2;
	},

	draw: function(ctx) {
		if (this.__video) {
			ctx.drawImage(this.__video, 0, 0, this.w, this.h);
		}
	}
});