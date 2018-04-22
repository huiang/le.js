game.DebugTestScene = le.Scene.extend({
	init: function() {
		le.Scene.fn.init.call(this);
		console.log(le.Scene.fn);
	},

	willEnter: function() {
		var self = this;
		var root = this.root;

		root.bind('mousemove', function(e){
			console.log(e);
		});
		root.bind('mousedown', function(e){
			console.log(e);
		});
		root.bind('mouseup', function(e){
			console.log(e);
		});

		var box = new game.Box().size(50, 100).pos(100, 100).color('rgba(255,0,0,255)').appendTo(root).setName('box');

		var rect = new le.RectColor('#eee').size(400, 400).anchor(1, 0).pos(500, 300).appendTo(root);

		// console.log(rect.getWorldBound());

		var box1 = new game.Box().anchor(0.5, 0.5).size(100, 100).pos(150, 150).color('rgba(255,0,0,255)').appendTo(rect).setName('box').bind('click', function(){
			console.log(box1.getWorldBound());
		});
		console.log(box1.getWorldBound());

		var repeatAction = new le.RepeatForever(
					new le.Seq(
						new le.MoveBy(600, 100, 100),
						new le.MoveBy(600, -100, -100),
					)
				);
		var repeatAction2 = new le.RepeatForever(
					new le.Seq(
						new le.Spwan(
							new le.MoveXBy(600, 100),
							new le.EasyIn(new le.MoveYBy(600, 100))
						),						
						new le.Spwan(
							new le.MoveXBy(600, -100),
							new le.EasyIn(new le.MoveYBy(600, -100))
						)
					)
				);

		var repeat = new le.Label("repeat", game.fonts.main).pos(550, 390).appendTo(root).bind("click", function(){
			box.runAction(repeatAction);
		});
		var repeat2 = new le.Label("repeat2", game.fonts.main).pos(650, 390).appendTo(root).bind("click", function(){
			box.runAction(repeatAction2);
		});
		new le.Label("stopRepeat", game.fonts.main).pos(550, 420).appendTo(root).bind("click", function(){
			box.stopAction(repeatAction);
		});
	}
});