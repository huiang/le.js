le.MouseEvent = function(event, x, y, type) {
	this.orign = event;
	this.type = type;
	this.x = x;
	this.y = y;
	this.swallowed = false;
};

le.MouseEvent.prototype.swallow = function() {
	this.swallowed = true;
};