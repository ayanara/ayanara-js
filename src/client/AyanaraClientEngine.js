import { ClientEngine, KeyboardControls } from 'lance-gg';
import AyanaraRenderer from './AyanaraRenderer';
import Viewport from './Viewport';

export default class AyanaraClientEngine extends ClientEngine {
    constructor(gameEngine, options) {
        super(gameEngine, options, AyanaraRenderer);
        this.setArea(this.getWindowSize());

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('up', 'up', { repeat: true } );
        this.controls.bindKey('down', 'down', { repeat: true } );
        this.controls.bindKey('left', 'left', { repeat: true } );
        this.controls.bindKey('right', 'right', { repeat: true } );
        this.controls.bindKey('space', 'space');

        const choiceEl = document.querySelector('.role-choice-presentation');

        document.getElementById('join-as-player').addEventListener('click', (e) => {
            this.chooseRole('player');
            choiceEl.classList.add('hidden');
        });

        document.getElementById('join-as-narrator').addEventListener('click', (e) => {
            this.chooseRole('narrator');
            choiceEl.classList.add('hidden');
        });

        window.addEventListener('resize', e => {
            this.setAreaFromWindow();
        });
        
        // ['mousemove', 'mousedown', 'mouseup']
        ['mousedown'].forEach(eventName => {
            document.addEventListener(eventName, e => {
                if (e.target.tagName == 'CANVAS') { 
                    const canvas = e.target;
                    this.sendInputUsingEvent(eventName, e, canvas) 
                }
            });
        });        
    }

    chooseRole(role) {
        this.renderer.role = role;
        this.sendInput('role', { value: role });
    }

    sendInputUsingEvent(inputName, event, viewEl) {
        const rect = viewEl.getBoundingClientRect();

        const zoom = this.renderer.zoom;
        const boardWidthInPixels = this.gameEngine.boardWidth * zoom / window.devicePixelRatio;
        const boardHeightInPixels = this.gameEngine.boardHeight * zoom / window.devicePixelRatio;
        const adjX = rect.width - boardWidthInPixels;
        const adjY = rect.height - boardHeightInPixels;

        // Even though the canvas covers the entire browser window, we only consider the "board"
        // part of the clickable screen, so adjust coordinates by assuming the board is centered
        // on the canvas (adjX, adjY).
        let x = event.clientX - rect.left - adjX / 2;
        let y = event.clientY - rect.top - adjY / 2;
        
        this.sendInput(inputName, this.screenToWorld(x, y, boardWidthInPixels, boardHeightInPixels));
    }

    screenToWorld(sx, sy, sw, sh) {
        const zoom = this.renderer.zoom;
        let x =  (sx - sw / 2) / zoom * window.devicePixelRatio;
        let y = -(sy - sh / 2) / zoom * window.devicePixelRatio;
        console.log('screenToWorld', sx, sy, sw, sh, x, y);
        return { x, y };
    }

    getWindowSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = window.devicePixelRatio;
        return { width, height, pixelRatio };
    }

    setArea({ width, height, pixelRatio }) {
        this.area = { width, height, pixelRatio };
        this.renderer.setCanvasSize( width * pixelRatio, height * pixelRatio );
    }
}
