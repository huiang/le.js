game.ActionTestScene = le.Scene.extend({
	init: function() {
		le.Scene.prototype.init.call(this);
	},

	willEnter: function() {
		var self = this, root = this.root;

		var box = new game.Box().size(50, 100).pos(100, 100).color('rgba(255,0,0,255)').appendTo(root).setName('box');

		new game.Box().size(10, 10).pos(25, 25).color('rgba(255,255,0,255)').appendTo(box);

		var moveTo1 = new le.Label("moveTo\n200:200", game.fonts.main).pos(20, 300).appendTo(root).bind("click", function(){
			box.runAction(new le.MoveTo(600, 200, 200));
		});
		var moveTo2 = new le.Label("moveTo\n100:100", game.fonts.main).pos(20, 330).appendTo(root).bind("click", function(){
			box.runAction(new le.MoveTo(600, 100, 100));
		});
		var moveBy1 = new le.Label("moveBy\n50:-50", game.fonts.main).pos(20, 360).appendTo(root).bind("click", function(){
			box.runAction(new le.MoveBy(600, 50, -50));
		});

		function stepClock(tag){
			console.log(tag + "step1", le.timer.now(), le.timer.ticker());

			box.runAction(new le.Callfunc(function(){
				console.log(tag + "step2", le.timer.now(), le.timer.ticker());
				box.runAction(new le.Callfunc(function(){
					console.log(tag + "step3", le.timer.now(), le.timer.ticker());
				}));
			}));

			box.runAction(new le.Seq(
				new le.Callfunc(function(){
					console.log(tag + "step5", le.timer.now(), le.timer.ticker());
				}),
				new le.Callfunc(function(){
					console.log(tag + "step6", le.timer.now(), le.timer.ticker());
				}),
				new le.Delay(100),
				new le.Callfunc(function(){
					console.log(tag + "step7", le.timer.now(), le.timer.ticker());					
				}),
				new le.Callfunc(function(){
					console.log(tag + "step8", le.timer.now(), le.timer.ticker());					
				})
			));
		}

		var clockAccuracy = new le.Label("clockAccuracy", game.fonts.main).pos(20, 390).appendTo(root).bind("click", function(){
			stepClock("clockAccuracy");
		});
		var timeOutRun = new le.Label("timeOutRun", game.fonts.main).pos(10, 420).appendTo(root).bind("click", function(){
			box.setTimeout(function(){
				stepClock("timeOutRun");
			},400);
		});
		var time0Run = new le.Label("time0Run", game.fonts.main).pos(10, 450).appendTo(root).bind("click", function(){
			box.setTimeout(function(){
				console.log("time0Run step0", le.timer.now(), le.timer.ticker());
				box.setTimeout(function(){
					stepClock("timeOutRun");
				},0);
			},0);
		});

		var scaleTo1 = new le.Label("scaleTo\n2:2", game.fonts.main).pos(150, 300).appendTo(root).bind("click", function(){
			box.runAction(new le.ScaleTo(600, 2));
		});
		var scaleTo2 = new le.Label("scaleTo\n1:1.2", game.fonts.main).pos(150, 330).appendTo(root).bind("click", function(){
			box.runAction(new le.ScaleTo(600, 1, 1.2));
		});
		var scaleBy = new le.Label("scaleBy\n3:3", game.fonts.main).pos(150, 360).appendTo(root).bind("click", function(){
			box.runAction(new le.ScaleBy(600, 3));
		});
		var valueTo = new le.Label("valueTo\n10:60", game.fonts.main).pos(150, 390).appendTo(root).bind("click", function(){
			box.runAction(new le.ValueTo(600, 10, 60, function(v, target){
				target.posX(v);
			}));
		});
		var rotateTo1 = new le.Label("rotateTo\n45", game.fonts.main).pos(250, 300).appendTo(root).bind("click", function(){
			box.runAction(new le.RotateTo(600, 45));
		});
		var rotateTo2 = new le.Label("rotateTo\n-180", game.fonts.main).pos(250, 330).appendTo(root).bind("click", function(){
			box.runAction(new le.RotateTo(600, -180));
		});
		var rotateBy = new le.Label("RotateBy\n45", game.fonts.main).pos(250, 360).appendTo(root).bind("click", function(){
			box.runAction(new le.RotateBy(600, 45));
		});
		var jumpTo = new le.Label("jumpTo", game.fonts.main).pos(350, 330).appendTo(root).bind("click", function(){
			box.runAction(new le.JumpTo(2000, 200, 100, 50, 3));
		});
		var jumpBy = new le.Label("jumpBy", game.fonts.main).pos(350, 360).appendTo(root).bind("click", function(){
			box.runAction(new le.JumpBy(2000, 200, 50, 50, 3));
		});
		var FadeTo1 = new le.Label("FadeTo: 1", game.fonts.main).pos(450, 300).appendTo(root).bind("click", function(){
			box.runAction(new le.FadeTo(600, 1));
		});
		var FadeTo2 = new le.Label("FadeTo: 0.2", game.fonts.main).pos(450, 330).appendTo(root).bind("click", function(){
			box.runAction(new le.FadeTo(600, 0.2));
		});
		var blink = new le.Label("Blink", game.fonts.main).pos(450, 360).appendTo(root).bind("click", function(){
			box.runAction(new le.Blink(2000, 3));
		});
		var seq = new le.Label("seq1", game.fonts.main).pos(550, 300).appendTo(root).bind("click", function(){
			box.runAction(
				new le.Seq(
					new le.ScaleTo(300, 2),
					new le.Callfunc(function(){
						console.log('callfunc1');
					}),
					new le.MoveBy(300, 50, 0), 
					new le.Callfunc(function(){
						console.log('callfunc2');
					}),
					new le.MoveBy(300, 0, 50),
					new le.Callfunc(function(){
						console.log('callfunc3');
					})
				)
			);
		});
		var spwan1 = new le.Label("Spwan1", game.fonts.main).pos(550, 330).appendTo(root).bind("click", function(){
			box.runAction(
				new le.Spwan(
					new le.ScaleTo(600, 2),
					new le.MoveBy(2200, 200, 100), 
					new le.FadeTo(600, 1),
					new le.Callfunc(function(){
						console.log('callfunc');
					})
				)
			);
		});
		var seq2 = new le.Label("hide\nshow", game.fonts.main).pos(550, 360).appendTo(root).bind("click", function(){
			box.runAction(
				new le.Seq(
					new le.Hide(),
					new le.Delay(1000),
					new le.Show()
				)
			);
		});

		var repeatAction = new le.RepeatForever(
					new le.Seq(
						new le.MoveBy(600, 100, 100),
						new le.Delay(500),
						new le.MoveBy(600, -100, -100),
						new le.Delay(500)
					)
				);

		var repeat = new le.Label("repeat", game.fonts.main).pos(550, 390).appendTo(root).bind("click", function(){
			box.runAction(repeatAction);
		});
		new le.Label("stopRepeat", game.fonts.main).pos(550, 420).appendTo(root).bind("click", function(){
			box.stopAction(repeatAction);
		});
		new le.Label("stopAll", game.fonts.main).pos(450, 390).appendTo(root).bind("click", function(){
			box.stopAllAction();
		});


		var box1 = null;
		new le.Label("add", game.fonts.main).pos(650, 300).appendTo(root).bind("click", function(){
			box1 = new game.Box().size(50, 100).pos(500, 100).color('rgba(0,255,0,255)').appendTo(root);
		});
		new le.Label("remove", game.fonts.main).pos(650, 330).appendTo(root).bind("click", function(){
			if (box1)
				box1.runAction(new le.Seq(new le.Delay(300), new le.FadeTo(300, 0.5), new le.RemoveSelf()));
		});
		new le.Label("place 300,300", game.fonts.main).pos(650, 360).appendTo(root).bind("click", function(){
			box.runAction(new le.Seq(new le.Delay(300), new le.FadeTo(300, 0.5), new le.Place(300, 300)));
		});


		var tbox = new game.Box().size(10, 10).pos(450, 50).color('rgba(255,0,0,255)').setName('tbox');

		var trace = new game.TraceCanvas(tbox).size(500, 500).pos(450, 50).setZIndex(-1);

		root.addChild(trace);
		root.addChild(tbox);

		var index = 0;
		["EasyIn", "EasyOut", "EasyInOut", "EaseExponentialIn", "EaseExponentialOut", "EaseSineIn", "EaseSineOut", "EaseSineInOut", "EaseElasticIn", "EaseElasticOut", "EaseElasticInOut", "BounceEaseIn", "BounceEaseOut", "BounceEaseInOut", "BackEaseIn", "BackEaseOut", "BackEaseInOut", "u1", "u2"].forEach(function(name) {
			var x = parseInt(index / 5) * 140 + 750;
			var y = (index % 5) * 30 + 300;
			new le.Label(name, game.fonts.main).pos(x, y).appendTo(root).bind("click", function(){
				var cls = le[name];
				tbox.pos(450, 50);
				trace.reset();
				if (name == 'u1') {	
					tbox.runAction(new le.EaseElasticOut(new le.MoveYBy(600, 150), 0.2));
				}
				else if (name == 'u2') {
					tbox.runAction(new le.EaseElasticOut(new le.MoveYBy(600, 150), 0.3));
				}
				else {
					tbox.runAction(new cls(new le.MoveYBy(600, 150)));
				}
				tbox.runAction(new le.MoveXBy(600, 150));
			});
			index++;
		});
	}
});