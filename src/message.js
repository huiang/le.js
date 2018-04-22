(function(){
function MessageInstance(type, data) {
	this.type = type;
	this.swallowed = false;
	this.data = data;
}
MessageInstance.prototype.swallow = function() {
	this.swallowed = true;
};

le.Message = Object.extend({
	init: function() {
		this._list = {};
	},

	listen: function(target, type, callback, priority) {
		if (this._list[type] == undefined) {
			this._list[type] = {lns:[], dirty: 0};
		}
		this._list[type].lns.push({fn:callback, t:target, p:priority ? priority : 0});
		this._list[type].dirty = 1;
	},

	unlisten: function(target, type, callback) {
		var list = this._list;
		if (type !== undefined) {
			if (list[type] != undefined) {
				for(var j = 0, len = list[type].lns.length; j < len; j++) {
					if (list[type].lns[j].t == target && 
						(callback === undefined || callback === list[type].lns[j].fn)
						) {
						list[type].lns[j].fn = null;
						list[type].lns.splice(j, 1);
						j--;
						len--;
					}
				}	
			}
		}
		else {
			for (var type in list) {
				for(var j = 0, len = list[type].lns.length; j < len; j++) {
					if (list[type].lns[j].t == target) {
						list[type].lns[j].fn = null;
						list[type].lns.splice(j, 1);
						j--;
						len--;
					}
				}
			}
		}
	},

	dispatch: function(type, data) {
		if (this._list[type] == undefined) {
			return;
		}
		var temp = this._list[type];
		var instance = new MessageInstance(type, data);
		if (temp.dirty) {
			temp.lns.sort(function(a, b){
				return -(a.p - b.p);
			});
			temp.dirty = 0;
		}
		//copy
		var matches = temp.lns.slice(0);

		for (var i in matches) {
			if (matches[i].fn) {
				matches[i].fn(instance, matches[i].t);
				if (instance.swallowed) {
					break;
				}
			}
		}
	}
});
window._messageSingle = new le.Message();
le.message = window._messageSingle;
})();