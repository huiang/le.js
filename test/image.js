game.ImageTestScene = le.Scene.extend({
	willEnter: function() {
		var self = this;
		var root = this.root;

		new le.Image("https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=3853850738,1579173117&fm=85&s=76A086E0044A9B4F5CA1A0220300704B").pos(200, 200).appendTo(root);
		new le.Image("https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=3853850738,1579173117&fm=85&s=76A086E0044A9B4F5CA1A0220300704B").pos(400, 200).size(200,200).appendTo(root);
		new le.Image("https://ss0.baidu.com/73t1bjeh1BF3odCf/it/error").pos(200, 400).size(200,200).appendTo(root);
	}
});