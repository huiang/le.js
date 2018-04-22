le.Timer = function() {
	this._id = 0;
	this._timers = [];
};
le.Timer.prototype._update = function(dt) {
	var timers = this._timers;
	for (var i = timers.length - 1; i >= 0; i--) {
		if (timers[i].id < 0) {
			timers.splice(i, 1);
		}
	}
	for (var i = 0; i < timers.length; i++) {
		if (timers[i].id < 0)
			continue;
		if (timers[i].n == -1) {
			timers[i].n = 0;
			timers[i].c = 0;		
		}
		else {
			timers[i].n += dt;
			timers[i].c += dt;
		}
		if (timers[i].n >= timers[i].iv) {
			timers[i].fn(timers[i].n, timers[i].c);
			if (timers[i].t >= 0 && timers[i].c >= timers[i].t) {
				timers[i].id = -1;
			}
			timers[i].n %= timers[i].iv;
		}
	}
	// for (var i = len, nlen = this._timers.length; i < nlen; i++) {
	// 	if (this._timers[i].id < 0)
	// 		continue;
	// 	if (this._timers[i].t == 0) {
	// 		le.timer.callAfterAll(this._timers[i].fn);
	// 		this._timers[i].id = -1;
	// 	}
	// }
};
le.Timer.prototype.setTimeout = function(callback, delay) {
	delay = typeof delay == 'undefined' ? 0 : delay;
	this._timers.push({
		iv: delay,
		c: 0,
		n: -1,
		t: delay,
		fn: callback,
		id: ++this._id //id<0 clear
	});
};

//interval <=0 为每帧都执行，
//times -1为永久执行
//times 不保证执行次数，保证执行时间
le.Timer.prototype.setInterval = function(callback, interval, times) {
	interval = typeof interval == 'undefined' ? -1 : interval;
	times = typeof times == 'undefined' ? -1 : times;
	if (times == 0)
		return;
	this._timers.push({
		iv: interval,
		c: 0,
		n: -1,
		t: times < 0 ? -1 : times * (interval > 0 ? interval : 1000/60),
		fn: callback,
		id: ++this._id //id<0 clear
	});
};
le.Timer.prototype.clearTimer = function(timerId) {
	for (var i = 0, len = this._timers.length; i < len; i++) {
		if (this._timers[i].id == timerId) {
			this._timers[i].id = -1;
			break;
		}		
	}
};
(function() {
	le.timer = new le.Timer();
	var afterAlls = [];
	le.timer.callAfterAll = function(callback) {
		afterAlls.push(callback);
	};
	le.timer._updateAfterAll = function() {
		for (var i = 0, len = afterAlls.length; i < len; i++) {
			afterAlls[i](0, 0);
		}
		afterAlls = [];
	};
	le.timer.now = function() {
		return le._clock;
	};
	le.timer.ticker = function() {
		return le._ticker;
	};
})();