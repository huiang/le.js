le.DebugFps = le.Node.extend({
	init:  function(director) {
		le.Node.prototype.init.call(this);
		this.anchor(0).size(180, 28);
		this.font = new le.Sysfont('microsoft yahei', 12, '#FFF');
		this.director = director;
	},
	draw: function(ctx) {
		ctx.fillStyle = 'rgba(0, 0, 0)';
		ctx.fillRect(0, 0, this.w, this.h);
		var debugData = this.director.debugData;

		this.font.beginDraw(ctx, 'left', 'middle');

		this.font.fillText(ctx, 'udt: ' + debugData.updateTime.toFixed(2), 0, 7);
		this.font.fillText(ctx, 'fps: ' + debugData.fps, 70, 7);
		this.font.fillText(ctx, 'objs: ' + debugData.objs, 130, 7);
		this.font.fillText(ctx, 'dw: ' + debugData.drawTime.toFixed(2), 0, 21);
		this.font.fillText(ctx, 'dfps: ' + debugData.drawFps, 70, 21);
		this.font.fillText(ctx, 'dws: ' + debugData.draws, 130, 21);
	}
});