var getFun = function(id) {
	return function() {
		return 'get.'+id;
	};
};
var foreachFun = function(el) {
	var no = 0;
	el.forEach(function(fn){
		no++;
		console.log('no: '+no+', res: '+fn());
	});
};
var forFun = function(el) {
	for (var i = 0, len = el.length; i < len; i++) {
		console.log('i: ' + i + ', res: ' + el[i]());
	}
};

var forInFun = function(el) {
	for (var i in el) {
		console.log('i: ' + i + ', res: ' + el[i]());
	}
};
//push
var a = [
	getFun(1), 
	function(){
		a.push(getFun(4));
		return 'push.2';
	}, 
	getFun(3)
];

//splice after
var b = [
	getFun(1), 
	function(){
		b.splice(2,1);
		return 'splice.2';
	},
	getFun(3)
];
//splice_self
var c = [
	getFun(1), 
	function(){
		c.splice(1,1);
		return 'splice.2';
	},
	getFun(3)
];
//splice_before
var d = [
	getFun(1), 
	function(){
		d.splice(0,1);
		return 'splice.2';
	},
	getFun(3)
];








