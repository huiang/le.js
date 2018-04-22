game.MessageTestScene = le.Scene.extend({
	willEnter: function() {
		var self = this, root = this.root;
		
		var box1 = new game.Box().size(10, 10).pos(30,50).setName("box1");
		var box2 = new game.Box().size(10, 10).pos(50,50).setName("box2");
		var last = null;
		var fn = function(tag) {
			last = function(msg, t) {
				console.log(tag, t.name);
			};
			return last;
		};
		var fn2 = function(tag) {
			last = function(msg, t) {
				msg.swallow();
				console.log("swallow", t.name);
			};
			return last;
		};
		var actions = {
			boxin: function() {
				if (box1.isRunning() == false)
					box1.appendTo(root);
			},			
			boxout: function() {
				box1.removeFromParent();
			},
			add1: function(tag){
				box1.listen("hello", fn(tag ? tag : "f1"));			
			},
			add2: function(tag) {
				box1.listen("hello", fn2(tag ? tag : "f2"), 10);
			},
			addp: function(tag) {
				box1.listen("hello", fn(tag ? tag : "fp"), 100);
			},
			unlistenCallback: function() {
				if (last) {
					box1.unlisten("hello", last);
					last = null;
				}
			},
			addBye: function(tag) {
				box1.listen("bye", fn(tag ? tag : "bye"));
			},
			unlistenHello: function() {
				box1.unlisten("hello");
			},
			unlistenAll: function() {
				box1.unlistenAll();
			},
			dispatch: function() {
				le.message.dispatch("hello", {});
			},
			dispatchBye: function() {
				le.message.dispatch("bye", {});
			}
		};
		var no = 0;
		for (var i in actions) {
			(function(callback, i){
				no++;
				new le.Label(i, game.fonts.main)
				.pos(100 + parseInt(no / 8) * 100, 50 + 40 * (no % 8))
				.appendTo(root)
				.bind("click", function(){
					callback();
				});							
			})(actions[i], i);
		}

		actions.boxin();

		var actions2 = {
			"test add remove": function() {
				console.log('=======');
				actions.boxin();
				actions.unlistenAll();
				actions.add1("vv");
				actions.dispatch();
				actions.boxout();
				actions.dispatch();
				actions.boxin();
				actions.dispatch();
				//vv ; vv
			},
			"test priority swallow": function() {
				console.log('=======');
				actions.boxin();
				box1.unlistenAll();

				actions.add1('p1');
				actions.add2();
				actions.addp('p2');
				actions.dispatch();
				//p2 ; swallow
			},
			"test callback add remove": function() {
				console.log('=======');
				actions.boxin();
				box1.unlistenAll();

				box1.listen("hello", function() {
					console.log("add deep1 call");
					box1.listen("hello", function() {
						console.log("add deep2 call");
					});
				});

				var fun = function(){
					console.log("remove deep1 call");
					box1.unlisten("hello", fun);
				};
				box1.listen("hello", fun);

				actions.dispatch();
				console.log('-----');
				actions.dispatch();
			},
			"test unlistenAll": function() {
				console.log('=======');
				actions.boxin();
				actions.unlistenAll();

				actions.addBye();
				actions.add1();

				actions.dispatch();
				actions.dispatchBye();

				actions.unlistenAll();
				console.log('-----');
				
				actions.dispatch();
				actions.dispatchBye();
			},
			"test unlistenType": function() {
				console.log('=======');
				actions.boxin();
				actions.unlistenAll();

				actions.addBye();
				actions.add1();
				actions.addp();

				actions.dispatch();
				actions.dispatchBye();

				actions.unlistenHello();
				console.log('-----');
				
				actions.dispatch();
				actions.dispatchBye();
			},
			"test unlistenCallback": function() {
				console.log('=======');
				actions.boxin();
				actions.unlistenAll();

				actions.addBye();
				actions.add1();
				actions.addp();

				actions.dispatch();
				actions.dispatchBye();

				actions.unlistenCallback();
				console.log('-----');
				
				actions.dispatch();
				actions.dispatchBye();
			}
		};

		var no = 0;
		for (var i in actions2) {
			(function(callback, i){
				no++;
				new le.Label(i, game.fonts.main)
				.pos(500 + parseInt(no / 8) * 100, 50 + 40 * (no % 8))
				.appendTo(root)
				.bind("click", function(){
					callback();
				});
			})(actions2[i], i);
		}
	}
});