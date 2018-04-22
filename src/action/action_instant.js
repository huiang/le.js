le.ActionInstant = le.Action.extend({
	init: function() {
		this.target = null;
		this.clock = 0;
		this.duration = 0;
	},

	start: function(target) {
		this.target = target;
		this.clock = 0;
	},

	isDone: function() {
		return true;
	},

	stop: function() {
		this.target = null;
	},

	isRunning: function() {
		return this.target != null;
	},

	update: function(dt) {
	},

	step: function(percent) {}
});
var ActionInstant = le.ActionInstant;
le.Show = ActionInstant.extend({
	update: function(dt) {
		this.target.setVisible(true);
	}
});

le.Hide = ActionInstant.extend({
	update: function(dt) {
		this.target.setVisible(false);
	}
});

le.Place = ActionInstant.extend({
	init: function(x, y) {
		ActionInstant.prototype.init.call(this);
		this.x = x;
		this.y = y;
	},

	update: function(dt) {
		this.target.pos(this.x, this.y);
	}
});

le.Callfunc = ActionInstant.extend({
	init: function(func) {
		ActionInstant.prototype.init.call(this);
		this.func = func;
	},

	update: function(dt) {
		this.func.call(this.target);
	}
});

le.RemoveSelf = ActionInstant.extend({
	update: function(dt) {
		this.target.removeFromParent();
	}
});