game.EventTestScene = le.Scene.extend({
	willEnter: function() {	
		var self = this;

		var scene = new le.Layer(this.director);
		scene.appendTo(this.root);

		var boxt = new game.Box().size(200, 200).pos(400, 400).color('rgba(0,0,0,255)').scale(0.5);
		boxt.bind('mousedown', function(event){
			console.log(event);
			var ret = boxt.convertToLocal(event);
			console.log(ret);
		}, le.NOINSIDE);
		boxt.appendTo(this.root);

		var box = new game.Box().size(50, 50).pos(200, 200).color('rgba(0,0,0,255)');
		box.setName('black');
		var box1 = new game.Box().size(50, 50).pos(10, 10).color('rgba(100,0,0,255)').setZIndex(1);
		box1.setName('brown');

		var box2 = new game.Box().size(50, 50).pos(10, 10).color('rgba(255,0,0,255)').setZIndex(-2);
		var box3 = new game.Box().size(50, 50).pos(20, 20).color('rgba(0,0,255,255)').setZIndex(-3);
		box2.setName('red');
		box3.setName('blue');
		box.addChild(box1);
		box.addChild(box2);
		box.addChild(box3);

		// box.showBorder();

		box.scale(2);
		box1.scale(0.5);

		// box.setTimeout(function(){
		// 	box.setTimeout(function(){
		// 		console.log('c2');
		// 	}, 1);
		// 	box.setTimeout(function(){
		// 		console.log('c1');
		// 		box.setInterval(function(dt, t){
		// 			box.pos(box.x+1, box.y+1);
		// 		}, -1, 120);
		// 	});
		// }, 100);

		box.bind('click', function(event){
			console.log('box black ' + event.type);
		});
		box1.bind('click', function(event){
			console.log('box1 brown ' + event.type);
		});
		box2.bind('click', function(event){
			console.log('box2 red ' + event.type);
		});
		box3.bind('click', function(event){
			console.log('box3 blue ' + event.type);
		});
		// for (var i = 0; i < 1000 ; i++) {
		// 	var b = new game.Box().size(50, 50).pos(500, 500).color('rgba(0,0,0,255)');
		// 	scene.addChild(b);
		// }

		scene.addChild(box);
	}
});