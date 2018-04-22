le.Page = le.Node.extend({
	init: function(pages) {
		le.Node.prototype.init.call(this);
		this.onCreatePage = null;
		this.onPageChange = null;
		this.pages = pages;
		this.current = 1;
		this._pageNodes = [];
	},

	setPages: function(pages) {
		this.pages = pages;
	},

	hasNext: function() {
		return this.current < this.pages;
	},

	hasPrev: function() {
		return this.current > 1;
	},

	scrollTo: function(pageNo, animate) {

	}
});