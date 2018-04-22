le.KeyboardEvent = function(event, key, keyCode, type) {
	this.orign = event;
	this.type = type;
	this.keyCode = keyCode;
	this.charCode = event.charCode;
	this.key = key;
	this.altKey = event.altKey;
	this.shiftKey = event.shiftKey;
	this.ctrlKey = event.ctrlKey;
	this.swallowed = false;
};

le.KeyboardEvent.prototype.swallow = function() {
	this.swallowed = true;
};