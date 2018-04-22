le.Switch = le.Node.extend({
	init: function(off, on) {
		le.Node.prototype.init.call(this);
		this.onNode = on;
		this.offNode = off;

		this.anchor(0.5, 0.5);
		this.size(on.w, on.h);
		
		on.pos(this.w/2, this.h/2).appendTo(this).setVisible(false);
		off.pos(this.w/2, this.h/2).appendTo(this);

		this.isOn = false;
		var self = this;
		this.onNode.bind("click", function(){
			self.setOn(false);
		});
		this.offNode.bind("click", function(){
			self.setOn(true);
		});

		this._callback = null;
	},

	onChange: function(callback) {
		this._callback = callback;
		return this;
	},

	setOn: function(isOn, triggerCallback) {
		if (this.isOn == isOn) {
			return this;
		}
		this.onNode.setVisible(isOn);
		this.offNode.setVisible(isOn == false);
		this.isOn = isOn;
		if (this._callback && triggerCallback != false) {
			this._callback(isOn);			
		}
		return this;
	}
});