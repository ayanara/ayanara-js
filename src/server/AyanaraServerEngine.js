import { ServerEngine, TwoVector } from 'lance-gg';

export default class AyanaraServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
    }
}
