import { ICanvas, IColor, IPoint } from './types';

export class Canvas implements ICanvas {
    public width: number;
    public height: number;
    private ctx: CanvasRenderingContext2D | null;

    constructor(public element: HTMLCanvasElement) {
        this.ctx = element.getContext('2d');
        this.width = element.width;
        this.height = element.height;
    }

    clear() {
        if (!this.ctx) {
            throw new Error('context is null');
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        return this;
    }

    path(points: IPoint[], color: IColor) {
        if (!this.ctx) {
            throw new Error('context is null');
        }

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }

        this.ctx.closePath();

        this.ctx.save();

        this.ctx.globalAlpha = color.a;
        this.ctx.fillStyle = color.toHex();
        this.ctx.strokeStyle = color.toHex();
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }
}
