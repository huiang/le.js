window.le = (function() {
	var api = {
		directors: [],
		timer: null,
		loader: null,
		message: null
	};
	api._clock = 0;
	api._ticker = 0;
	this._error = '';

	api.NOSWALLOW = 2;
	api.NOINSIDE = 4;

	api.REPLACE = 2;

	api.loadDirector = function(mixValue, func) {
		var director = new le.Director(mixValue, func);
		api.directors.push(director);
		return director;
	};

	api.removeDirector = function(director) {
		for (var i in api.directors) {
			if (api.directors == directors) {
				var dtor = api.directors[i];
				dtor._exit();
				api.directors.splice(i, 1);
				break;
			}
		}
	};

	api.reportError = function(e) {
		console.log(e);
		this._error = e;
	};

	var tasks = [];
	var ntasks = [];
	var stepRunning = false;
	api.step = {
		add: function(func) {
			if (stepRunning)
				ntasks.push(func);
			else
				tasks.push(func);
			this.run();
			return this;
		},

		run: function() {
			if (stepRunning)
				return this;
			stepRunning = true;
			while (tasks.length > 0) {
				var last = tasks.shift();
				last();
				tasks = ntasks.concat(tasks);
				ntasks = [];
			}
			stepRunning = false;
		}
	};

	function update(dt) {
		api._clock += dt;
		api._ticker ++;
		if (api.timer) {
			api.timer._update(dt);			
		}
		for (var i in api.directors) {
			api.directors[i].update(dt);
		}
		if (api.timer) {
			api.timer._updateAfterAll();		
		}
		for (var i in api.directors) {
			api.directors[i]._updateAfterAll(dt);
		}
	};

	window.leSetAnimateFrameInterval(update);

	return api;
})();