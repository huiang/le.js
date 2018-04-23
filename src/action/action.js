le.Action = Object.extend({
	init: function() {
	
	},

	isRunning: function() {
		return false;
	},

	stop: function() {

	},

	start: function() {
		
	}
});
le.ActionInterval = le.Action.extend({
	init: function(duration) {
		this.duration = duration;
		this.clock = 0;
		this.target = null;
		this.fc = true;
	},

	getDuration: function() {
		return this.duration;
	},

	start: function(target) {
		this.target = target;
		this.clock = 0;
		this.fc = true;
	},

	isDone: function() {
		return this.clock >= this.duration;
	},

	stop: function() {
		this.target = null;
	},

	isRunning: function() {
		return this.target != null;
	},

	update: function(dt) {
		if (this.target == null)
			return;
		if (this.fc) {
			this.fc = false;
			this.clock = 0;
		}
		else {
			this.clock += dt;
		}
		if (this.duration > 0) {
			var p = this.clock / this.duration;
			if (p > 1)
				p = 1;
			else if (p < 0)
				p = 0;
			this.step(p);
		}
		else {
			this.step(this.clock > 0 ? 1 : 0);
		}
	},

	step: function(percent) {

	}
});

var ActionInterval = le.ActionInterval;
var ActionIntervalInit = ActionInterval.prototype.init;
var ActionIntervalStart = ActionInterval.prototype.start;

le.ActionEasy = ActionInterval.extend({
	init: function(action) {
		ActionIntervalInit.call(this, action.duration);
		this.inner = action;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.inner.start(this.target);
	},

	stop: function() {
		ActionInterval.prototype.stop.call(this);
		this.inner.stop();
	},

	step: function(percent) {
		this.inner.step(percent);
	}
});

le.Seq = ActionInterval.extend({
	init: function(arg) {
		var actions = arg instanceof Array ? arg : Array.prototype.slice.call(arguments, 0);
		var d = 0;
		for (var i = 0, len = actions.length; i < len; i++) {
			d += actions[i].duration;
		}
		ActionIntervalInit.call(this, d);
		this._actions = actions;
		this._last = -1;
		this.ld = 0;
		this.fc = true;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this._last = -1;
		this.ld = 0;
		this.fc = true;
	},

	stop: function() {
		if (this._last != -1) {
			this._actions[this._last].stop();
		}
		ActionInterval.prototype.stop.call(this);
	},

	update: function(dt) {
		var actions = this._actions, last = this._last;
		if (this.fc) {
			this.fc = false;
			this.clock = 0;
			this.ld = 0;
			if (actions.length > 0) {
				actions[0].start(this.target);
				actions[0].update(0);
				last = 0;
			}
			else {
				return;
			}
		}
		else {
			this.clock += dt;
			this.ld += dt;
			if (last != -1) {
				actions[last].update(dt);
			}
		}

		while (last != -1) {
			if (actions[last].isDone() == false) {
				break;
			}
			actions[last].stop();
			if (last + 1 >= actions.length) {
				last = -1;
				break;
			}
			this.ld -= actions[last].duration;
			last++;
			actions[last].start(this.target);
			actions[last].update(0);
			if (this.ld > 0) {
				if (actions[last].isDone())
					continue;
				actions[last].update(this.ld);
			}
		}
		this._last = last;
	}
});

le.Spwan = ActionInterval.extend({
	init: function(arg) {
		var actions = arg instanceof Array ? arg : Array.prototype.slice.call(arguments, 0);
		var d = 0;
		for (var i = 0, len = actions.length; i < len; i++) {
			if (actions[i].duration > d)
				d = actions[i].duration;
		}
		this._actions = actions;
		ActionIntervalInit.call(this, d);
	},

	update: function(dt) {
		if (this.fc) {
			this.fc = false;
			this.clock = 0;
		}
		else {
			this.clock += dt;
		}
		var actions = this._actions; 
		for (var i = 0, len = actions.length; i < len; i++) {
			if (actions[i].isRunning() == false) {
				continue;
			} 
			actions[i].update(dt);
			if (actions[i].isDone()) {
				actions[i].stop();
			}
		}
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		for (var i = 0, len = this._actions.length; i < len; i++) {
			this._actions[i].start(target);
		}
	}
});

le.RepeatForever = ActionInterval.extend({
	init: function(action) {
		ActionIntervalInit.call(this, action.duration);
		this._inner = action;
		this.ld = 0;
	},

	isDone: function() {
		return false;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this._inner.start(target);
		this.ld = 0;
	},	

	update: function(dt) {
		var inner = this._inner;
		if (this.fc) {
			this.fc = false;
			this.clock = 0;
			this.ld = 0;
			dt = 0;
			inner.start(this.target);
			inner.update(0);
		}
		else {
			this.clock += dt;
			this.ld += dt;
			inner.update(dt);
		}
		if (inner.isDone()) {
			inner.stop();
			inner.start(this.target);
			inner.update(0);
			this.ld = this.ld - this.duration;
			if (this.ld > 0 && inner.isDone() == false)
				inner.update(this.ld);
		}
	}
});

le.MoveBy = ActionInterval.extend({
	init: function(duration, x, y) {
		ActionIntervalInit.call(this, duration);
		this.dx = x;
		this.dy = y;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
		this.y = target.y;
	},

	step: function(percent) {
		this.target.pos(this.x + this.dx * percent, this.y + this.dy * percent);
	}
});

le.MoveTo = ActionInterval.extend({
	init: function(duration, x, y) {
		ActionIntervalInit.call(this, duration);
		this.tx = x;
		this.ty = y;
		this.dx = 0;
		this.dy = 0;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
		this.y = target.y;
		this.dx = this.tx - this.x;
		this.dy = this.ty - this.y;
	},

	step: function(percent) {
		this.target.pos(this.x + this.dx * percent, this.y + this.dy * percent);
	}
});

le.MoveXBy = ActionInterval.extend({
	init: function(duration, x) {
		ActionIntervalInit.call(this, duration);
		this.dx = x;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
	},

	step: function(percent) {
		this.target.posX(this.x + this.dx * percent);
	}
});

le.MoveXTo = ActionInterval.extend({
	init: function(duration, x) {
		ActionIntervalInit.call(this, duration);
		this.tx = x;
		this.dx = 0;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
		this.dx = this.tx - this.x;
	},

	step: function(percent) {
		this.target.posX(this.x + this.dx * percent);
	}
});

le.MoveYBy = ActionInterval.extend({
	init: function(duration, y) {
		ActionIntervalInit.call(this, duration);
		this.dy = y;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.y = target.y;
	},

	step: function(percent) {
		this.target.posY(this.y + this.dy * percent);
	}
});

le.MoveYTo = ActionInterval.extend({
	init: function(duration, y) {
		ActionIntervalInit.call(this, duration);
		this.dy = y;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.y = target.y;
		this.dy = this.dy - this.y;
	},

	step: function(percent) {
		this.target.posY(this.y + this.dy * percent);
	}
});

le.ScaleBy = ActionInterval.extend({
	init: function(duration, scaleX, scaleY) {
		ActionIntervalInit.call(this, duration);
		this.ssx = scaleX;
		this.ssy = typeof scaleY == 'undefined' ? scaleX : scaleY;
		this.dsx = 0;
		this.dsy = 0;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.sx = target.scaleX;
		this.sy = target.scaleY;
		this.dsx = this.ssx * this.sx - this.sx;
		this.dsy = this.ssy * this.sy - this.sy;
	},

	step: function(percent) {
		this.target.scale(this.sx + this.dsx * percent, this.sy + this.dsy * percent);
	}
});

le.ScaleTo = ActionInterval.extend({
	init: function(duration, scaleX, scaleY) {
		ActionIntervalInit.call(this, duration);
		this.tsx = scaleX;
		this.tsy = typeof scaleY == 'undefined' ? scaleX : scaleY;
		this.dsx = 0;
		this.dsy = 0;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.sx = target.scaleX;
		this.sy = target.scaleY;
		this.dsx = this.tsx - this.sx;
		this.dsy = this.tsy - this.sy;
	},

	step: function(percent) {
		this.target.scale(this.sx + this.dsx * percent, this.sy + this.dsy * percent);
	}
});

le.RotateTo = ActionInterval.extend({
	init: function(duration, angle) {
		ActionIntervalInit.call(this, duration);
		this.tag = angle;
		this.dag = 0;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.ag = target.rotation % 360;
		this.dag = this.tag - this.ag;
		if (this.dag > 180)
			this.dag -= 360;
		else if (this.dag < -180)
			this.dag += 360;
	},

	step: function(percent) {
		this.target.setRotation(this.ag + this.dag * percent);
	}
});

le.RotateBy = ActionInterval.extend({
	init: function(duration, angle) {
		ActionIntervalInit.call(this, duration);
		this.dag = angle;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.ag = target.rotation;
	},

	step: function(percent) {
		this.target.setRotation(this.ag + this.dag * percent);
	}
});

le.JumpBy = ActionInterval.extend({
	init: function(duration, x, y, h, jumps) {
		ActionIntervalInit.call(this, duration);
        this.dx = x;
		this.dy = y;
        this.h = -h;
        this.jumps = jumps;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.x = target.x;
		this.y = target.y;
	},

	step: function(percent) {
		var frac = (percent * this.jumps) % 1;
        var y = this.h * 4 * frac * (1 - frac);
        y += this.dy * percent;
        this.target.pos(this.dx * percent + this.x, this.y + y);
	}
});

le.JumpTo = le.JumpBy.extend({
	init: function(duration, x, y, h, jumps) {
		le.JumpBy.prototype.init.call(this, duration, x, y, h, jumps);
	},

	start: function(target) {
		le.JumpBy.prototype.start.call(this, target);
		this.dx = this.dx - this.x;
		this.dy = this.dy - this.y;
	}
});

le.Blink = ActionInterval.extend({
	init: function(duration, times) {
		ActionIntervalInit.call(this, duration);
		this.times = times;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.origin = target.visible;
	},

	stop: function() {
		this.target.setVisible(this.origin);
		ActionInterval.prototype.stop.call(this);
	},

	step: function(percent) {
		var slice = 1 / this.times;
		var m = percent % slice;
		this.target.setVisible(m > slice / 2 ? true : false);
	}
});

le.Delay = ActionInterval.extend({
});

le.FadeTo = ActionInterval.extend({
	init: function(duration, opa) {
		ActionIntervalInit.call(this, duration);
		this.dopa = opa;
	},

	start: function(target) {
		ActionIntervalStart.call(this, target);
		this.opa = target.opacity;
		this.dopa = this.dopa - this.opa;
	},

	step: function(percent) {
		this.target.setOpacity(this.opa + this.dopa * percent);
	}
});

le.ValueTo = ActionInterval.extend({
	init: function(duration, from, to, callback) {
		ActionIntervalInit.call(this, duration);
		this.from = from;
		this.to = to;
		this.callback = callback;
	},

	step: function(percent) {
		this.callback(this.from + percent * (this.to - this.from), this.target);
	}
});