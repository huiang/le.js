var game = {};
var index = {
	init: function() {
		game.director = le.loadDirector('main', function(w, h) {
			console.log('resolution', w, h);
			this.setDesignResolutionSize(w, h);
		});
		
		game.director.showFps();

		game.fonts = {};
		game.fonts.main = new le.Sysfont('microsoft yahei', 14, '#000');
		game.fonts.large = new le.Sysfont('microsoft yahei', 18, '#000');
		game.fonts.blue = new le.Sysfont('microsoft yahei', 24, '#00F').attr({'lineHeight': 36});
		game.fonts.black = new le.Sysfont('microsoft yahei', 16, '#000').attr({'lineHeight': 36});

		var back = new le.Label("返回", game.fonts.large)
		.pos(50, 80)
		.appendTo(game.director.world)
		.setZIndex(100)
		.bind("click", function(){	
			console.log('click');
			var scenes = game.director._scenes;
			if (scenes.length > 1) {
				game.director.finishScene(scenes[scenes.length - 1]);
			}
		});
		game.director.startScene(new index.FlashScene());
	},

	loadSmall: function() {
		document.getElementById('small').style.display = 'block';
		game.small = le.loadDirector('small', function(w, h) {
			console.log('resolution', w, h);
			this.setDesignResolutionSize(w * 2, h * 2);
		});
		game.small.showFps();

		game.small.startScene(new index.FlashScene());
		new le.Label("返回", game.fonts.large)
		.pos(20, 50)
		.setZIndex(1000)
		.appendTo(game.small.world)
		.bind("click", function(){
			var scenes = game.small._scenes;
			if (scenes.length > 1) {
				game.small.finishScene(scenes[scenes.length - 1]);
			}
		});
	}
};

index.FlashScene = le.Scene.extend({
	init: function() {
		le.Scene.prototype.init.call(this);
	},

	willLoad: function() {

		var size = this.director.winSize;

		new le.Label("loading...", game.fonts.main)
		.pos(size.w/2, size.h/2)
		.setName('loading')
		.appendTo(this.root);

		var self = this;
		self.incTask();
		le.loader.load({"type":"image","src":"res/texture/test_new.png", "name":"test_new.png"}, function(){
			le.spriteFrameCache.add(le.loader.getImage("test_new.png"), frameTextJson);
			self.decTask();
		});

		self.incTask();
		this.root.setTimeout(function(){
			self.decTask();
		}, 100);
	},

	didLoad: function() {
		this.root.removeChild('loading');
	},

	willEnter: function() {
		this.director.startScene(new index.HomeScene(), le.REPLACE);
	}
});

index.HomeScene = le.Scene.extend({
	willEnter: function() {

		var height = this.director.winSize.h;

		var bg = new le.Sprite("hbg_bg.png")
		.pos(0, 0)
		.anchor(0, 0)
		.scale(0.7)
		.clip(true)
		.appendTo(this.root);
		
		var newDirector = new le.Label('loadSmallDirector', game.fonts.blue).pos(200, 80).appendTo(this.root);
		newDirector.bind("click", function(){
			index.loadSmall();
		});

		var list = [
		// 'TextureTest'
			'LabelTest','ActionTest','ClipTest', 'FpsTest', 'ImageTest', 'LiveTest'
		];

		// var list = [
		// // 'TextureTest'
		// 	'LabelTest','ActionTest','InputTest','VideoTest','TimerTest','EventTest','ClipTest', 'FpsTest', 'DebugTest', 'MessageTest', 'ImageTest', 'LiveTest'
		// ];
		var self = this;
		for (var i in list) {		
			var temp = list[i];
			var x = parseInt(i / 7);
			var y = i % 7;
			(function(temp, x, y){
				new le.Label(temp, game.fonts.main).pos(480 + x * 150, 150 + y * 50).setLineHeight(30).appendTo(self.root).bind("click", function(){
					var scene = new game[temp + 'Scene']();
					self.director.startScene(scene);
				});
			})(temp, x, y);
		}

		var createOne = function(delay) {
			var leaf = new le.Sprite("hbg_leaf_"+Math.floor(Math.rand(1, 4.99999))+".png");
			var con = new le.Node();
			con.addChild(leaf);

			bg.addChild(con);

			var x = Math.rand(300, 1500);
			var y = -200;
			var t = Math.rand(3, 8) * 1000;
			var dx = Math.rand(600 * height/1080, 900 * height/1080);
			var dy = height + 400;

			con.setTimeout(function(dt){
				con.runAction(new le.Seq(
					new le.MoveTo(t, x - dx, y + dy), new le.RemoveSelf()
					));
				var adt = Math.rand(1.6 * 1000, 3.4 * 1000);
				var sdt = adt / 8;
				con.runAction(new le.RepeatForever(new le.RotateBy(adt, 360)));
				leaf.runAction(new le.RepeatForever(
					new le.Seq(
						new le.ScaleTo(sdt, 0.2, 1),
						new le.Callfunc(function(){
							leaf.scale(-0.2, 1);
						}),
						new le.ScaleTo(sdt, -1, 1),
						new le.ScaleTo(sdt, -0.2, 1),
						new le.Callfunc(function(){
							leaf.scale(0.2, 1);
						}),
						new le.ScaleTo(sdt, 1, 1)
						)
					));
			}, delay);

            con.setRotation(Math.rand(-50.0, 50.0));
            con.scale(Math.rand(0.8, 1.0));
            con.pos(x, y);
		};
		bg.setInterval(function(dt) {
            for (var i = 0, max = Math.rand(100, 160); i < max; i++) {
                createOne(Math.rand(0.0, 9000));
            }
        }, 10000);
        for (var i = 0, max = Math.rand(100, 160); i < max; i++) {
            createOne(Math.rand(0.0, 9000));
        }
        var clicka = new le.Node().size(300, 400).pos(150, 220).showBorder().bind('click', function(){  
	        for (var i = 0, max = Math.rand(16, 24); i < max; i++) {
	            createOne(Math.rand(0.0, 900));
	        }
        }).appendTo(bg);
	}
});

index.SceneTestScene = le.Scene.extend({
	init: function(){
		le.Scene.prototype.init.call(this);
	},

	willLoad: function() {
		console.log('willLoad');
		this.finish();
	},

	willEnter: function() {
		console.log('willEnter');
		this.root.addChild();
	},

	willExit: function() {
		console.log('willExit');
	},

	didExit: function() {
		console.log('didExit');
	},

	didLoad: function() {
		console.log('didLoad');
	},

	didEnter: function() {
		console.log('didEnter');
	}
});

game.Box = le.Node.extend({
	init: function() {
		le.Node.prototype.init.call(this);
		this._color = '#FF0000';
		this.anchorX = 0.5;
		this.anchorY = 0.5;
	},

	color: function(color) {
		this._color = color;
		this.contentDirty();
		return this;
	},

	draw: function(ctx) {
		ctx.fillStyle = this._color;
		ctx.fillRect(0, 0, this.w, this.h);
	}
});

game.TraceCanvas = le.Node.extend({
	init: function(target) {
		le.Node.prototype.init.call(this);
		this._color = '#FF0000';
		this.traces = [];
		this.lastx = 0;
		this.lasty = 0;
		this.target = target;
		var self = this;
		this.setInterval(function(dt, clock) {
			if (target.x != self.lastx || target.y != self.lasty) {
				self.lastx = target.x;
				self.lasty = target.y;
				self.traces.push([target.x, target.y]);	
				self.contentDirty();
			}
		});
	},

	color: function(color) {
		this._color = color;
		// this.contentDirty();
		return this;
	},

	reset: function() {
		this.traces = [];
		this.contentDirty();
	},

	draw: function(ctx) {			
		if (this.traces.length > 0) {
			ctx.beginPath();
			ctx.lineWidth = "3";
			ctx.strokeStyle = "black";
			var dx = 0.5 * this.target.w - this.x;
			var dy = 0.5 * this.target.h - this.y;
			ctx.moveTo(this.traces[0][0] + dx, this.traces[0][1] + dy)
			for (var i = 1; i < this.traces.length; i++) {
				ctx.lineTo(this.traces[i][0] + dx, this.traces[i][1] + dy);
			}
			ctx.stroke();
		}
		this.dirty = 0;
	}
});