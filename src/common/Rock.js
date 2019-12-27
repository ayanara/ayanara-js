import { DynamicObject, BaseTypes } from 'lance-gg';

export default class Rock extends DynamicObject {
    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.inputId = 0;
    }

    static get netScheme() {
        return Object.assign({
            inputId: { type: BaseTypes.TYPES.INT32 },
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.inputId = other.inputId;
    }

    draw(ctx, view) {
        ctx.strokeStyle = '#ffb';
        ctx.lineWidth = 2.0 / this.gameEngine.zoom;
        ctx.beginPath();
        ctx.arc(
            this.position.x,
            this.position.y,
            0.5, 0, 2 * Math.PI);
        ctx.stroke();
    }
}