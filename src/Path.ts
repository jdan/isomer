import { Point } from './Point';
import { IPath, IPoint, ScaleBy, TranslateBy } from './types';

export class Path implements IPath {
    public points: IPoint[];

    static Rectangle(origin: IPoint, width: number = 1, height: number = 1) {
        return new Path([
            origin,
            new Point(origin.x + width, origin.y, origin.z),
            new Point(origin.x + width, origin.y + height, origin.z),
            new Point(origin.x, origin.y + height, origin.z),
        ]);
    }

    static Circle(origin: IPoint, radius: number, vertices: number = 20) {
        let path = new Path();

        for (let i = 0; i < vertices; i++) {
            path.push(
                new Point(
                    radius * Math.cos((i * 2 * Math.PI) / vertices),
                    radius * Math.sin((i * 2 * Math.PI) / vertices),
                    0
                )
            );
        }

        path.translate([origin.x, origin.y, origin.z]);
        return path;
    }

    constructor(points: IPoint[] = []) {
        this.points = points.map((point) => point.duplicate());
    }

    duplicate(): IPath {
        return new Path(this.points);
    }

    push(point: IPoint): IPath {
        this.points.push(point);
        return this;
    }

    reverse(): IPath {
        this.points = this.points.reverse();
        return this;
    }

    translate(delta: TranslateBy): IPath {
        this.points.forEach((point) => {
            point.translate(delta);
        });
        return this;
    }

    scale(origin: IPoint, multiplier: ScaleBy): IPath {
        this.points.forEach((point) => {
            point.scale(origin, multiplier);
        });
        return this;
    }

    rotateX(origin: IPoint, angle: number): IPath {
        this.points.forEach((point) => {
            point.rotateX(origin, angle);
        });
        return this;
    }

    rotateY(origin: IPoint, angle: number): IPath {
        this.points.forEach((point) => {
            point.rotateY(origin, angle);
        });
        return this;
    }

    rotateZ(origin: IPoint, angle: number): IPath {
        this.points.forEach((point) => {
            point.rotateZ(origin, angle);
        });
        return this;
    }

    depth(): number {
        const sum = this.points.reduce((output, point) => {
            return output + point.depth();
        }, 0);

        return sum / (this.points.length || 1);
    }
}
