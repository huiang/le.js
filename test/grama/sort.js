var a = [{p:1, v:1},{p:1,v:2},{p:3,v:3}];
a.sort(function(c,d){
	return c.p - d.p;
});
a.sort(function(c,d){
	return d.p - c.p;
});