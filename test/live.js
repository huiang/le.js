var live = {};
game.LiveTestScene = le.Scene.extend({
	willEnter: function() {
		var self = this;
		var root = this.root;

		var curve = new live.Curve(1, 1, 1).size(300, 300).pos(50, 50).appendTo(root).showBorder();

		window.curve = curve;

		var curve2 = new live.Curve(1, 1, -20).size(300, 300).pos(350, 350).appendTo(root).showBorder();

		window.curve2 = curve2;
	}
});

live.Curve = le.Node.extend({
	init: function(a, b, c) {
		le.Node.prototype.init.call(this);
		this.a = a;
		this.b = b;
		this.c = c;
		this.graduation = 10;
		this.clip(true);
	},

	setA: function(a) {
		this.a = a;
		this.contentDirty();
	},

	setB: function(b) {
		this.b = b;
		this.contentDirty();	
	},

	setC: function(c) {
		this.c = c;
		this.contentDirty();
	},

	draw: function(ctx) {
		var mw = this.w
		var mh = this.h

		var dis = 1;
        var begin = false;
        ctx.translate(mw/2, mh/2);
        ctx.scale(1, -1);
        var lastx = null;
        var lasty = null;
        for (var i = -mw / 2; i < mw / 2; i = i + dis) {
            var vx = i / this.graduation;
            var vy = (this.a * vx * vx + this.b * vx + parseFloat(this.c));

            var x = vx * this.graduation;
            var y = vy * this.graduation;
            
            if (y > mh / 2 || y < -mh / 2) {
            	if (begin) {
            		ctx.lineTo(x, y);
			        ctx.stroke();
			        begin = false;
            	}
            }
            else {
            	if (begin == false) {
            		ctx.beginPath();
            		if (lastx != null) {
		                ctx.moveTo(lastx, lasty);
		                ctx.lineTo(x, y);
            		}
            		else {
		                ctx.moveTo(x, y);
            		}
	                begin = true;
	            }
	            else {
	            	ctx.lineTo(x, y);	            	
	            }
            }
            lastx = x;
            lasty = y;
        }
        if (begin) {
	        ctx.stroke();
        }
	}
});