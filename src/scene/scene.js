le.Scene = Object.extend({
	init: function() {
		this._indent = {};
		this._data = {};
		this.root = null;
		this._status = 'INITED';
		this._from = 'PUSH_IN';
		this._todoTasks = 0;
		this.director = null;
	},

	setIntent: function(key, value) {
		this._indent[key] = value;
	},

	getIntent: function(key) {
		return this._indent[key];
	},

	etData: function(key, value) {
		this._data[key] = value;
	},

	getData: function(key) {
		return this._data[key];
	},

	_doStart: function(director, parent) {
		this.director = director;
		if (this.root != null) {
			this.root.removeFromParent();
		}
		this.root = new le.Layer(this.director);
		this.root.bind('mouseup mousedown mousemove mousecancel', function(event) {
			event.swallow();
		});
		parent.addChild(this.root);
		this._status = 'LOADING';
		this.incTask();

		var self = this;
		le.step.add(function(){
			self.willLoad();	
		}).add(function(){
			self.decTask();
		});
	},

	_doFinish: function() {
		if (this._status == 'FINISHED' || this._status == 'FINISHING') {
			return;
		}
		this._status = 'FINISHING';
		var self = this;
		le.step.add(function() {
			if (self._status == 'FINISHING')
				self.willExit();
		}).add(function() {
			if (self._status != 'FINISHING')
				return;
			if (self.root != null) {
				self.root.removeFromParent();
				self.root = null;
			}
			this._status = 'FINISHED';
			self.didExit();
		});
	},

	incTask: function() {
		this._todoTasks++;
	},

	decTask: function() {
		this._todoTasks--;
		while (this._todoTasks <= 0 && this._status == 'LOADING') {
			var self = this;
			this._status = 'LOADED';
			le.step.add(function(){
				if (self._status == 'LOADED')
					self.didLoad();
			})
			.add(function(){
				if (self._status == 'LOADED') {
					self.willEnter();	
					self._status = 'RUNNING';
				}
			})
			.add(function(){
				if (self._status == 'RUNNING') {
					self.didEnter();
				}
			});
		}
	},

	finish: function() {
		if (this.director != null) {
			this.director.finishScene(this);
		}
		else {
			le.director.reportError('finish with no start');
		}
	},

	finishWithResult: function() {

	},

	willLoad: function() {

	},

	didLoad: function() {

	},

	willEnter: function() {

	},

	didEnter: function() {

	},

	willExit: function() {

	},

	didExit: function() {

	}
});