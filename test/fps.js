game.FpsTestScene = le.Scene.extend({
	init: function() {
		le.Scene.prototype.init.call(this);
	},

	willEnter: function() {
		var self = this;

		var root = this.root;

		var boxes = [];
		for (var i = 0; i < 30; i++) {
			boxes.push(new game.Box().size(50, 100).pos(100 + 80 * (i % 12), 100 + parseInt(i / 12) * 150).color('rgba(255,0,0,255)').appendTo(root).setName('box'));
		}
		for (var i in boxes) {
			boxes[i].runAction(new le.RepeatForever(
				new le.Seq(
					new le.MoveBy(600, 100, 100),
					new le.MoveBy(600, -100, -100)
				)
			));
		}
	}
});