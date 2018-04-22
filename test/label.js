game.LabelTestScene = le.Scene.extend({
	init: function() {
		le.Scene.prototype.init.call(this);
	},

	willEnter: function() {
		var self = this;

		var fonts = {};
		fonts.main = new le.Sysfont('microsoft yahei', 16, '#F00');
		fonts.blue = new le.Sysfont('microsoft yahei', 24, '#00F');
		fonts.black = new le.Sysfont('microsoft yahei', 16, '#000');
		fonts.bm = new le.BitmapFont("b_bmfont", 30);
		fonts.me = new le.BitmapFont("clan_mefont", 16);

		var w1 = new le.Label("左侧的字", fonts.main)
		.pos(200, 100)
		.appendTo(this.root);

		w1.setTimeout(function(dt) {
			w1.setText("右侧的字号码\n是是是码");
		}, 1000);
		w1.setTimeout(function(dt) {
			w1.setTextAlign("right");
		}, 2000);
		w1.setTimeout(function(dt) {
			w1.setFont(fonts.blue).setTextAlign('center');
		}, 3000);

		var w2 = new le.Label("测试dimision", fonts.main).pos(20, 200).anchor(0, 0).setDimension(32, 0)
		.appendTo(this.root);
		new le.Label("测试", fonts.black).pos(150, 200).anchor(0, 0).setDimension(10, 0).appendTo(this.root).showBorder();
		new le.Label("are you ok\ni am very happy", fonts.black).pos(250, 200).anchor(0, 0).setDimension(70, 0).appendTo(this.root).showBorder();

		new le.Label("Not half 加强肯定语气的表达“非常”菲菲喜欢飞镖运动，Neil 喜欢吃比萨。当我们说喜欢某物的程度是“not half”时，And those who were seen dancing were thought to be insane by those who could not hear the music我们到底是喜欢还是不喜欢呢？听节目，学习一个加强肯定语气的口语表达。", fonts.black).pos(20, 400).anchor(0, 0).setDimension(200, 0).setLineHeight(20).appendTo(this.root).showBorder();

		new le.Label("微信支付", fonts.bm).pos(400, 200).anchor(0, 0).appendTo(this.root).showBorder();

		w1.showBorder();
		w2.showBorder();

	}
});
/*
label.MeasureTime = le.Node.extend({
	init: function() {
		le.Node.prototype.init.call(this);
		this.font = new le.Sysfont('microsoft yahei', 12, '#FFF');
		this.texts = [];
		for (var i = 0; i < 1000; i++) {
			var string = '发生大宋放大';
		}
		this.randoms = 'abcdefghijklmnopqrstuvwxyz我们来到了这一天仅的天地奥速度爱上大法师阿斯顿发生大宋放大';
		var self = this;
		this.setInterval(function(dt, c){
			self.dirty |= 2;
		}, 500);
	},

	update: function(dt) {
		// this.dirty |= 2;
	},

	draw: function(ctx) {
		// ctx.font = this.font.font;
		// for (var i = 0; i < 1000; i++) {
		// 	var res = ctx.measureText('发生大宋放大发生大宋放大发生大宋放大');
		// 	// if (i == 0)
		// 	// 	console.log(res)
		// }
		ctx.font = this.font.font;
		for (var i = 0; i < 100000; i++) {
			this.randoms.charCodeAt(1) > 127;
			this.randoms.charCodeAt(2) > 127;
			this.randoms.charCodeAt(3) > 127;
			this.randoms.charCodeAt(4) > 127;
			this.randoms.charCodeAt(5) > 127;
			this.randoms.charCodeAt(6) > 127;
			this.randoms.charCodeAt(7) > 127;
			this.randoms.charCodeAt(8) > 127;
			this.randoms.charCodeAt(9) > 127;
			this.randoms.charCodeAt(10) > 127;
			// if (i == 0)
			// 	console.log(res)
		}
	},

	random: function() {
	}
});*/