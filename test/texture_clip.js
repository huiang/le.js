game.TextureTestScene = le.Scene.extend({
	willLoad: function() {
		var self = this;
		self.incTask();
		le.loader.load({"type":"image","src":"https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=3853850738,1579173117&fm=85&s=76A086E0044A9B4F5CA1A0220300704B", "name":"ss.png"}, function(){
			le.spriteFrameCache.add(le.loader.getImage("ss.png"), "ss.png");
			self.decTask();
		}, function() {
			self.finish();
		});
		le.loader.load({"type":"image","src":"https://ss0.baidu.com/7322t1bjeh1BF3odCf222/it/u=3853850738,1579173117&fm=85&s=76A086E0044A9B4F5CA1A0220300704B222", "name":"ss22.png"}, function(){
			console.log("load image success");
			le.spriteFrameCache.add(le.loader.getImage("ss22.png"), "ss22.png");
		}, function() {
			console.log('load image failed.');
		});
	},

	willEnter: function() {
		var self = this, root = this.root;

		var top = new le.Sprite("hbg_top.png");
		var bg = new le.Sprite("hbg_bottom.png");
		
		top.pos(root.w/2, root.h - bg.h + 4)
		.anchor(0.5, 1)
		.showBorder()
		.scale(root.w * 1.2 / top.w, 1)
		.appendTo(this.root);


		bg.pos(root.w/2, root.h + 2)
		.anchor(0.5, 1)
		.appendTo(this.root);

		var btn1 = new le.Button("home_ph_normal.png", "home_ph_pressed.png")
		.showBorder()
		.pos(root.w/2 - 400, root.h / 2 + 200)
		.appendTo(this.root).bind('click', function(){
			console.log('btn1 click');
		});

		var btn2 = new le.Button("home_ph_normal.png", null, "home_ph_pressed.png")
		.showBorder()
		.pos(root.w/2 - 200, root.h / 2 + 200)
		.appendTo(this.root).bind('click', function(){
			console.log('btn2 click');
		});

		var btn3 = new le.Button("home_ph_normal.png", null, null, "home_qq_pressed.png")
		.showBorder()
		.pos(root.w/2, root.h / 2 + 200)
		.appendTo(this.root).bind('click', function(){
			btn3.setEnable(false);
			console.log('btn3 click');
		});

		var btn4 = new le.Button("home_ph_normal.png")
		.showBorder()
		.pos(root.w/2 + 200, root.h / 2 + 200)
		.appendTo(this.root).bind('click', function(){
			btn3.setEnable(true);
			console.log('btn4 click');
		});

		var switcher = new le.Switch(
			new le.Button("home_ph_normal.png", "home_ph_pressed.png"),
			new le.Button("home_qq_normal.png", "home_ph_pressed.png")
		).onChange(function(on){
			console.log(on + 'on');
		})
		.showBorder()
		.pos(400, 200)
		.appendTo(this.root);

		var rc = new le.RectColor('#F00').size(100,100).pos(600, 200).appendTo(this.root).showBorder();

		var ss = new le.Sprite("ss.png").pos(root.w/2, root.h/2).showBorder().appendTo(this.root);
		console.log(ss.w, ss.h);
	}
});

game.ClipTestScene = le.Scene.extend({
	init: function() {
		le.Scene.prototype.init.call(this);
	},

	willEnter: function() {
		var self = this;

		var con = new le.Node().size(500, 100).clip(true).pos(100, 100).showBorder().cacheContent(10).appendTo(this.root);

		var bg = new le.Sprite("hbg_bottom.png").pos(50, 50).appendTo(con);

		var b1 = new game.Box().size(20, 20).pos(-12, -12).appendTo(con);
		new game.Box().size(20, 20).pos(30, 30).appendTo(b1);

		var b2 = new game.Box().size(20, 20).pos(100, 10).appendTo(con).enableClipInherit();
		var b22 = new game.Box().size(20, 20).pos(-12, -12).appendTo(b2);
		new game.Box().size(20, 20).pos(50, 50).appendTo(b22);

		var b3 = new game.Box().size(20, 20).pos(200, -12).scale(2).appendTo(con);



		var bot = new le.Node().size(500, 100).pos(100, 400).showBorder().appendTo(this.root);
		{			
			var bg = new le.Sprite("hbg_bottom.png").pos(50, 50).appendTo(bot).setZIndex(-1);

			var b1 = new game.Box().size(20, 20).pos(-12, -12).appendTo(bot);
			new game.Box().size(20, 20).pos(30, 30).appendTo(b1);

			var b2 = new game.Box().size(20, 20).pos(100, 10).appendTo(bot).enableClipInherit();
			var b22 = new game.Box().size(20, 20).pos(-12, -12).appendTo(b2);
			new game.Box().size(20, 20).pos(50, 50).appendTo(b22);

			var b3 = new game.Box().size(20, 20).pos(200, -12).scale(2).appendTo(bot);
		}
	}
});