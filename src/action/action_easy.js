var ActionEasy = le.ActionEasy;
var ActionEasyInit = le.ActionEasy.prototype.init;
le.EasyIn = ActionEasy.extend({
	init: function(action, rate) {
		ActionEasyInit.call(this, action);
		this.rate = typeof rate == 'undefined' ? 2 : rate;
	},

	step: function(percent) {
		this.inner.step(Math.pow(percent, this.rate));
	}
});

le.EasyOut = ActionEasy.extend({
	init: function(action, rate) {
		ActionEasyInit.call(this, action);
		this.rate = typeof rate == 'undefined' ? 2 : rate;
	},

	step: function(percent) {
		this.inner.step(Math.pow(percent, 1/this.rate));
	}
});

le.EasyInOut = ActionEasy.extend({
	init: function(action, rate) {
		ActionEasyInit.call(this, action);
		this.rate = typeof rate == 'undefined' ? 2 : rate;
	},

	step: function(percent) {
		percent *= 2;
		if (percent < 1) {
			this.inner.step(0.5 * Math.pow(percent, this.rate));
		}
	    else {
			this.inner.step(1 - 0.5 * Math.pow(2 - percent, this.rate));
		}
	}
});

le.EaseExponentialIn = ActionEasy.extend({
	step: function(percent) {
		percent = (percent == 0 ? 0 : Math.pow(2, 10 * (percent/1 - 1)) - 1 * 0.001);
		this.inner.step(percent);
	}
});

le.EaseExponentialOut = ActionEasy.extend({
	step: function(percent) {
		percent = (percent == 1 ? 1 : (-Math.pow(2, -10 * percent / 1) + 1));
		this.inner.step(percent);
	}
});
le.EaseExponentialInOut = ActionEasy.extend({
	step: function(percent) {
		percent /= 0.5;
	    if (percent < 1)
	        percent = 0.5 * Math.pow(2, 10 * (percent - 1));
	    else
	        percent = 0.5 * (-Math.pow(2, -10 * (percent - 1)) + 2);
		this.inner.step(percent);
	}
});

le.EaseSineIn = ActionEasy.extend({
	step: function(percent) {
		percent = -1 * Math.cos(percent * Math.PI/2) + 1;
		this.inner.step(percent);
	}
});
le.EaseSineOut = ActionEasy.extend({
	step: function(percent) {
		percent = Math.sin(percent * Math.PI/2);
		this.inner.step(percent);
	}
});
le.EaseSineInOut = ActionEasy.extend({
	step: function(percent) {
		percent = -0.5 * (Math.cos(percent * Math.PI) - 1)
		this.inner.step(percent);
	}
});
le.EaseElasticIn = ActionEasy.extend({
	init: function(action, period) {
		ActionEasyInit.call(this, action);
		this.period = typeof period == 'undefined' ? 0.3 : period;
	},

	step: function(percent) {
		var newT = 0;
	    if (percent == 0 || percent == 1)
			newT = percent;
	    else {
	    	var s = this.period / 4;
	        percent = percent - 1;
	        newT = - Math.pow(2, 10 * percent) * Math.sin((percent - s) * Math.PI/ 2 / this.period);
	    }
		this.inner.step(newT);
	}
});
le.EaseElasticOut = ActionEasy.extend({
	init: function(action, period) {
		ActionEasyInit.call(this, action);
		this.period = typeof period == 'undefined' ? 0.3 : period;
	},

	step: function(percent) {
		var newT = 0;
		if (percent == 0 || percent == 1)
			newT = percent;
		else {			
			var s = this.period / 4;
			newT = Math.pow(2, -10 * percent) * Math.sin((percent - s) * Math.PI / 2 / this.period) + 1;
		}
		this.inner.step(newT);
	}
});
le.EaseElasticInOut = ActionEasy.extend({
	init: function(action, period) {
		ActionEasyInit.call(this, action);
		this.period = typeof period == 'undefined' ? 0.3 : period / 1000;
	},

	step: function(percent) {
		var newT = 0;
		if (percent == 0 || percent == 1)
			newT = percent;
		else
		{
			percent = percent * 2;
			if (!this.period)
				this.period = 0.3 * 1.5;

			var s = this.period / 4;

			percent = percent - 1;
			if (percent < 0) {
				newT = -0.5 * Math.pow(2, 10 * percent) * Math.sin((percent -s) * Math.PI / 2 / this.period);
			}
			else {
				newT = Math.pow(2, -10 * percent) * Math.sin((percent - s) * Math.PI / 2 / this.period) * 0.5 + 1;
			}
		}
		this.inner.step(newT);
	}
});
(function(){
function bounceTime(time) {
	if (time < 1 / 2.75) {
		return 7.5625 * time * time;
    }
	else if (time < 2 / 2.75) {
		time -= 1.5 / 2.75;
		return 7.5625 * time * time + 0.75;
	}
	else if(time < 2.5 / 2.75) {
		time -= 2.25 / 2.75;
		return 7.5625 * time * time + 0.9375;
	}
	time -= 2.625 / 2.75;
    return 7.5625 * time * time + 0.984375;
}

le.BounceEaseIn = ActionEasy.extend({
	init: function(action) {
		ActionEasyInit.call(this, action);
		this.period = typeof period == 'undefined' ? 0.3 : period / 1000;
	},

	step: function(percent) {
		this.inner.step(1 - bounceTime(1 - percent));
	}
});
le.BounceEaseOut = ActionEasy.extend({
	step: function(percent) {
		this.inner.step(bounceTime(percent));
	}
});
le.BounceEaseInOut = ActionEasy.extend({
	step: function(percent) {
		var newT = 0;
		if (percent < 0.5) {
			percent = percent * 2;
			newT = (1 - bounceTime(1 - percent)) * 0.5;
		}
		else {
			newT = bounceTime(percent * 2 - 1) * 0.5 + 0.5;
		}
		this.inner.step(newT);
	}
});
})();

le.BackEaseIn = ActionEasy.extend({
	step: function(percent) {
		this.inner.step(percent * percent * ((1.70158 + 1) * percent - 1.70158));
	}
});

le.BackEaseOut = ActionEasy.extend({
	step: function(percent) {
		percent = percent - 1;
		this.inner.step(percent * percent * ((1.70158 + 1) * percent + 1.70158) + 1);
	}
});

le.BackEaseInOut = ActionEasy.extend({
	step: function(percent) {
		var newT = 0;
		var overshoot = 1.70158 * 1.525;

		percent = percent * 2;
		if (percent < 1) {
			newT = (percent * percent * ((overshoot + 1) * percent - overshoot)) / 2;
		}
		else {
			percent = percent - 2;
			newT = (percent * percent * ((overshoot + 1) * percent + overshoot)) / 2 + 1;
		}

		this.inner.step(newT);
	}
});