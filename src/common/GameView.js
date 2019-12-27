import { DynamicObject, BaseTypes } from 'lance-gg';

export default class GameView extends DynamicObject {
    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.inputId = 0;
        this.capability = 'play';
    }

    static get netScheme() {
        return Object.assign({
            inputId: { type: BaseTypes.TYPES.INT32 },
            capability: { type: BaseTypes.TYPES.STRING }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.inputId = other.inputId;
        this.capability = other.capability;
    }

    get color() {
        switch (this.capability) {
            case 'play': return '#FFF';
            case 'control': return '#F88';
            case 'design': return '#8F9';
            default: console.error('Unknown capability:', this.capability);
        }
    }
}