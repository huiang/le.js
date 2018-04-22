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
		le.loader.load({"type":"image","src":"res/texture/cr0.png", "name":"cr0.png"}, function(){
			le.spriteFrameCache.add(le.loader.getImage("cr0.png"), frameCrJsonZ);
			self.decTask();
		});
		self.incTask();
		le.loader.load({"type":"image","src":"res/texture/cr1.png", "name":"cr1.png"}, function(){
			le.spriteFrameCache.add(le.loader.getImage("cr1.png"), frameCrJsonO);
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
		var newDirector = new le.Label('loadSmallDirector', game.fonts.blue).pos(200, 80).appendTo(this.root);
		newDirector.bind("click", function(){
			index.loadSmall();
		});

		var craft = new le.Sprite("hbg_craft.png")
		.pos(400, 100)
		.scale(0.15)
		.appendTo(this.root);

		craft.setOpacity(0).runAction(new le.FadeTo(600, 1));

		var list = [
			'LabelTest','ActionTest','InputTest','VideoTest','TextureTest','TimerTest','EventTest','ClipTest', 'FpsTest', 'DebugTest', 'MessageTest', 'ImageTest', 'LiveTest'
		];
		var self = this;
		for (var i in list) {		
			var temp = list[i];
			var x = parseInt(i / 6);
			var y = i % 6;
			(function(temp, x, y){
				new le.Label(temp, game.fonts.main).pos(100 + x * 150, 200 + y * 50).setLineHeight(30).appendTo(self.root).bind("click", function(){
					var scene = new game[temp + 'Scene']();
					self.director.startScene(scene);
				});
			})(temp, x, y);
		}
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