import { GameEngine, SimplePhysicsEngine, TwoVector } from 'lance-gg';
import GameView from './GameView';
import Rock from './Rock';

/**
 * Game engine events:
 *  postStep, objectAdded
 */
export default class AyanaraGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        // create physics with no friction; wrap positions after each step
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });

        // this.on('objectAdded', (object) => { console.log('objectAdded', object); });

        // game variables
        Object.assign(this, {
            boardWidth: 16,
            boardHeight: 9,
            miniZoom: 0.33333,
            viewports: []
        });
        this.miniWidth = this.boardWidth * this.miniZoom;
        this.miniHeight = this.boardHeight * this.miniZoom;
        this.microWidth = this.miniWidth / 3.0;
        this.microHeight = this.miniHeight / 3.0;
    }

    registerClasses(serializer) {
        serializer.registerClass(GameView);
        serializer.registerClass(Rock);
    }

    processInput(inputData, playerId, isServer) {
        super.processInput(inputData, playerId);
        const { input, options, messageIndex } = inputData;

        if (input === 'role') {
            this.addGameView(playerId, messageIndex, options.value);
            if (!isServer) {
                if (options.value === 'player') {
                    
                }
            }
        }
        if (input === 'mousedown') {
            console.log('click', options);
            this.addRock(options.x, options.y, messageIndex);
        }
    }

    addRock(x, y, inputId) {
        const rock = new Rock(this, null, {
            position: new TwoVector(x, y)
        });
        rock.inputId = inputId;
        this.addObjectToWorld(rock);
    }

    // addWall(x1, y1, x2, y2, inputId) {
    //     const wall = new Wall(this, null, {});
    // }

    addGameView(playerId, inputId, role) {
        let gameView = new GameView(this, null, { playerId });
        
        // Add inputId so that eager creation of GameView object can be
        // de-duplicated once server version arrives at client.
        gameView.inputId = inputId;

        switch (role) {
            case 'player': gameView.capability = 'play'; break;
            case 'narrator': gameView.capability = 'control'; break;
            default: console.error('Unknown role', role);
        }
        return this.addObjectToWorld(gameView);
    }
}
