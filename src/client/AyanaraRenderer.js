import { Renderer } from 'lance-gg';
import GameView from '../common/GameView';
import Rock from '../common/Rock';

export default class AyanaraRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.game = gameEngine;

        this.role = 'undecided';
        this.viewports = [];

        this.activeControlView = null;
        this.activePlayView = null;

        this.miniZoom = 0.33333;
        this.miniWidth = this.game.boardWidth * this.miniZoom;
        this.miniHeight = this.game.boardHeight * this.miniZoom;
        this.microWidth = this.miniWidth / 3.0;
        this.microHeight = this.miniHeight / 3.0;
    }

    setCanvasSize(width, height) {
        const set = (canvas) => { canvas.width = width; canvas.height = height; }
        if (this.canvas) { set(this.canvas); } else { this.makeCanvas(set); }
        this.zoom = this.calculateZoom(width, height);
        this.makeContext();
    }
 
    calculateZoom(width, height) {
        if (this.game.boardHeight > 0) {
            const heightZoom = height / this.game.boardHeight;
            if (this.game.boardWidth > 0) {
                if (width / this.game.boardWidth < heightZoom) {
                    return width / this.game.boardWidth;
                } else {
                    return heightZoom;
                }
            }
        }
        return 1.0;
    }

    makeCanvas(beforeInsertion) {
        this.canvas = document.createElement('canvas');
        if (beforeInsertion) beforeInsertion(this.canvas);
        document.body.insertBefore(this.canvas, document.getElementById('level'));
    }

    makeContext() {
        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = this.ctx.fillStyle = 'white';
    }

    draw(t, dt) {
        super.draw(t, dt);

        // window.GameView = GameView;
        // window.game = this.gameEngine;


        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Transform the canvas
        // Note that we need to flip the y axis since Canvas pixel coordinates
        // goes from top to bottom, while physics does the opposite.
        this.ctx.save();
        this.ctx.translate(this.canvas.width/2, this.canvas.height/2); // Translate to the center
        this.ctx.scale(this.zoom, -this.zoom);  // Zoom in and flip y axis

        // Draw all things
        switch (this.role) {
            case 'undecided':
                break;
            case 'player':
                const gameView = this.game.world.queryObject({ playerId: this.game.playerId, instanceType: GameView });
                if (gameView) {
                    this.drawView(
                        -this.game.boardWidth / 2, -this.game.boardHeight / 2,
                        this.game.boardWidth, this.game.boardHeight
                    );
                }
                break;
            case 'narrator':
                const gameViews = this.game.world.queryObjects({ instanceType: GameView });
                if (gameViews.length == 0) {
                    this.drawView(
                        -this.game.boardWidth / 2, -this.game.boardHeight / 2,
                        this.game.boardWidth, this.game.boardHeight
                    );
                } else {

                    let controlViews = gameViews.filter(view => view.capability === 'control');
                    // Auto-assign an active control view, if at least one is available
                    // TODO: do this only when views are added or removed
                    if (this.activeControlView == null || !controlViews.some(view => view == this.activeControlView)) {
                        if (controlViews.length > 0) this.activeControlView = controlViews[0];
                    }

                    let playViews = gameViews.filter(view => view.capability === 'play');
                    // Auto-assign an active play view, if at least one is available
                    // TODO: do this only when views are added or removed
                    if (this.activePlayView == null || !playViews.some(view => view == this.activePlayView)) {
                        if (playViews.length > 0) this.activePlayView = playViews[0];
                    }

                    this.drawMiniViewSet(
                        this.activeControlView, controlViews,
                        -this.game.boardWidth / 2, this.game.boardHeight / 2
                    );

                    this.drawMiniViewSet(
                        this.activePlayView, playViews,
                        -this.game.boardWidth / 2, 0
                    );

                    // Main design panel
                    this.drawView(
                        -this.game.boardWidth / 2 + this.miniWidth, -this.game.boardHeight / 2,
                        this.game.boardWidth - this.miniWidth, this.game.boardHeight
                    )
                }
                break;
            default:
                console.error("Role is neither 'player' nor 'narrator'.");
        }


        this.ctx.restore();
    }

    drawMiniViewSet(activeView, views, left, top) {
        if (activeView) {
            this.ctx.strokeStyle = activeView.color;
            this.ctx.lineWidth = 2.0 / this.zoom;
            this.ctx.strokeRect( left, top, this.miniWidth, -this.miniHeight );
        }
        if (views.length > 1) {
            views.forEach((view, i) => {
                if (activeView && view.id == activeView.id) {
                    this.ctx.lineWidth = 4.0 / this.zoom;
                } else {
                    this.ctx.lineWidth = 2.0 / this.zoom;
                }
                this.ctx.strokeRect(
                    left + (i * this.microWidth), top - this.miniHeight,
                    this.microWidth, -this.microHeight
                );
            });
        }
    }

    drawView(left, bottom, width, height) {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2.0 / this.zoom;
        this.ctx.strokeRect(left, bottom, width, height);

        this.game.world.forEachObject((id, obj) => {
            if (obj.draw) {
                obj.draw(this.ctx, this.activePlayView);
            }
        });
    }
}
