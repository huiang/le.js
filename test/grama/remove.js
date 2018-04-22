var a = [1,2,3,4,5,6,7,8];
for (var i = 0, len = a.length; i < len; i++) {
	console.log(a[i]);
	if (a[i] == 4) {
		a.splice(i, 1);
		i--;
		len--;
	}
	if (a[i] == 7)
		a.push(9);
}
console.log(a);

console.log('NaN ?', NaN ? 'true' : 'false');
console.log('undefined ?', undefined ? 'true' : 'false');
console.log('null ?', null ? 'true' : 'false');
console.log('0 ?', 0 ? 'true' : 'false');
console.log('false ?', false ? 'true' : 'false');
console.log('"" ?', "" ? 'true' : 'false');
console.log('{} ?', {} ? 'true' : 'false');
console.log('[] ?', [] ? 'true' : 'false');

console.log('!NaN ?', !NaN ? 'true' : 'false');
console.log('!undefined ?', !undefined ? 'true' : 'false');
console.log('!null ?', !null ? 'true' : 'false');
console.log('!0 ?', !0 ? 'true' : 'false');
console.log('!false ?', !false ? 'true' : 'false');
console.log('!"" ?', !"" ? 'true' : 'false');
console.log('!{} ?', !{} ? 'true' : 'false');
console.log('![] ?', ![] ? 'true' : 'false');

console.log('undefined == NaN', undefined == NaN);
console.log('null == NaN', null == NaN);
console.log('0 == NaN', 0 == NaN);
console.log('false == NaN', false == NaN);
console.log('"" == NaN', "" == NaN);
console.log('{} == NaN', {} == NaN);
console.log('[] == NaN', [] == NaN);

console.log('null == undefined', null == undefined);
console.log('0 == undefined', 0 == undefined);
console.log('false == undefined', false == undefined);
console.log('"" == undefined', "" == undefined);
console.log('{} == undefined', {} == undefined);
console.log('[] == undefined', [] == undefined);

console.log('0 == null', 0 == null);
console.log('false == null', false == null);
console.log('"" == null', "" == null);
console.log('{} == null', {} == null);
console.log('[] == null', [] == null);

console.log('false == 0', false == 0);
console.log('"" == 0', "" == 0);
console.log('{} == 0', {} == 0);
console.log('[] == 0', [] == 0);

console.log('"" == false', "" == false);
console.log('{} == false', {} == false);
console.log('[] == false', [] == false);

console.log('{} == ""', {} == "");
console.log('[] == ""', [] == "");

console.log('[] == {}', [] == {});

console.log('null === undefined', null === undefined);
console.log('0 === undefined', 0 === undefined);
console.log('false === undefined', false === undefined);
console.log('"" === undefined', "" === undefined);
console.log('{} === undefined', {} === undefined);
console.log('[] === undefined', [] === undefined);

console.log('0 === null', 0 === null);
console.log('false === null', false === null);
console.log('"" === null', "" === null);
console.log('{} === null', {} === null);
console.log('[] === null', [] === null);

console.log('false === 0', false === 0);
console.log('"" === 0', "" === 0);
console.log('{} === 0', {} === 0);
console.log('[] === 0', [] === 0);

console.log('"" === false', "" === false);
console.log('{} === false', {} === false);
console.log('[] === false', [] === false);

console.log('{} === ""', {} === "");
console.log('[] === ""', [] === "");

console.log('[] === {}', [] === {});