export default class Viewport {
    constructor(ctx, region) {
        this.ctx = ctx;
        this.region = region;
    }

    drawBorder() {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2.0 / this.zoom;
        this.ctx.strokeRect(left, bottom, width, height);
    }
}