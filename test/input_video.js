game.InputTestScene = le.Scene.extend({
	init: function() {
		le.Scene.prototype.init.call(this);
	},
	willEnter: function() {
		var self = this;


		var input = new le.Input(game.fonts.main);
		input.size(50, 30);
		input.pos(100, 100);
		input.showBorder();
		input.appendTo(this.root);

		input.focus();
	}
});

game.VideoTestScene = le.Scene.extend({
	init: function() {
		le.Scene.prototype.init.call(this);
	},
	willEnter: function() {
		var self = this, root = this.root;
		
		var video = new le.Video("http://v.leleketang.com/dat/ps/ma/k/video/24692.ogv");

		video.size(360, 200).pos(300, 200).showBorder().appendTo(this.root);

		video.bind("click", function(){
			console.log('click');
			video.play();
		});
	}
});