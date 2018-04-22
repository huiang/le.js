game.TimerTestScene = le.Scene.extend({
	willEnter: function() {
		var self = this;

		var scene = new le.Layer(this.director);
		scene.appendTo(this.root);

		scene.bind("click", function(){
		scene.setTimeout(function(){
			var box = new game.Box()
			.size(50, 50)
			.pos(100, 100)
			.color('rgba(255,0,0,255)');

			console.log(le.timer.now(), le.timer.ticker(), 'compare');
			box.setTimeout(function(){
				console.log(le.timer.now(), le.timer.ticker(), 'compare');				
			}, 120);

			console.log(le.timer.now(), le.timer.ticker(), 'interval');
			box.setInterval(function(){
				console.log(le.timer.now(), le.timer.ticker(), 'interval');				
			}, 1000);

			console.log(le.timer.now(), le.timer.ticker(), 'begin');
			box.setTimeout(function(){
				console.log(le.timer.now(), le.timer.ticker(), 't1');
				box.setTimeout(function(){
					console.log(le.timer.now(), le.timer.ticker(), 't2');
				});
			});

			box.runAction(
				new le.Seq(
					new le.Callfunc(function(){
						console.log(le.timer.now(), le.timer.ticker(),'s1');
						box.runAction(new le.Callfunc(function(){
							console.log(le.timer.now(), le.timer.ticker(),'s4');
						}));
					}),
					new le.Callfunc(function(){
						console.log(le.timer.now(), le.timer.ticker(),'s2');
					})
				)
			);
			box.runAction(new le.Callfunc(function(){
				console.log(le.timer.now(), le.timer.ticker(),'s3');
			}));
			box.runAction(new le.Callfunc(function(){
				var b = new game.Box()
				.size(50, 50)
				.pos(200, 100)
				.color('rgba(0,255,0,255)');
				b.setTimeout(function(){
					console.log(le.timer.now(), le.timer.ticker(), 'bbb');
				});
				b.appendTo(scene);
			}));

			box.appendTo(scene);
		});
		});
	}
});