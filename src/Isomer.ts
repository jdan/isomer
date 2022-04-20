import { Canvas } from './Canvas';
import { Color } from './Color';
import { Path } from './Path';
import { Point } from './Point';
import { Shape } from './Shape';
import {
    ICanvas,
    IColor,
    IIsomer,
    IPath,
    IPoint,
    IsomerOptions,
    IVector,
    Position,
    Transformation,
} from './types';
import { Vector } from './Vector';

export class Isomer implements IIsomer {
    private canvas: ICanvas;
    private angle: number;
    private scale: number;
    private originX: number;
    private originY: number;
    private lightPosition: IVector;
    private lightAngle: IVector;
    private colorDifference: number;
    private lightColor: IColor;
    private transformation: Transformation;

    constructor(
        canvas: HTMLCanvasElement,
        options: Partial<IsomerOptions> = {}
    ) {
        options = options || {};

        this.canvas = new Canvas(canvas);
        this.angle = Math.PI / 6;

        this.scale = options.scale || 70;

        this.transformation = this.calculateTransformation();

        this.originX = options.originX || this.canvas.width / 2;
        this.originY = options.originY || this.canvas.height * 0.9;

        /**
         * Light source as defined as the angle from
         * the object to the source.
         *
         * We'll define somewhat arbitrarily for now.
         */
        this.lightPosition = options.lightPosition || new Vector(2, -1, 3);
        this.lightAngle = this.lightPosition.normalize();

        /**
         * The maximum color difference from shading
         */
        this.colorDifference = 0.2;
        this.lightColor = options.lightColor || new Color(255, 255, 255);
    }

    setLightPosition(position: Position) {
        const [x, y, z] = position;
        this.lightPosition = new Vector(x, y, z);
        this.lightAngle = this.lightPosition.normalize();
    }

    translatePoint(point: IPoint) {
        const xMap = new Point(
            point.x * this.transformation[0][0],
            point.x * this.transformation[0][1],
            0
        );

        const yMap = new Point(
            point.y * this.transformation[1][0],
            point.y * this.transformation[1][1],
            0
        );

        const x = this.originX + xMap.x + yMap.x;
        const y = this.originY - xMap.y - yMap.y - point.z * this.scale;

        return new Point(x, y, 0);
    }

    add(item: any, baseColor: IColor = new Color(120, 120, 120)) {
        if (Array.isArray(item)) {
            for (let i = 0; i < item.length; i++) {
                this.add(item[i], baseColor);
            }
        } else if (item instanceof Path) {
            this.addPath(item, baseColor);
        } else if (item instanceof Shape) {
            /* Fetch paths ordered by distance to prevent overlaps */
            const paths = item.orderPaths().paths;

            for (let j = 0; j < paths.length; j++) {
                this.addPath(paths[j], baseColor);
            }
        }
    }

    private addPath(path: IPath, baseColor: IColor) {
        /* Compute color */
        const v1 = Vector.FromTwoPoints(path.points[1], path.points[0]);
        const v2 = Vector.FromTwoPoints(path.points[2], path.points[1]);

        const normal = v1.crossProduct(v2).normalize();

        /**
         * Brightness is between -1 and 1 and is computed based
         * on the dot product between the light source vector and normal.
         */
        const brightness = normal.dotProduct(this.lightAngle);
        const color = baseColor
            .duplicate()
            .lighten(brightness * this.colorDifference, this.lightColor);

        const translatedPoints = path.points.map((point) => {
            return this.translatePoint(point);
        });

        this.canvas.path(translatedPoints, color);
    }

    /**
     * Precalculates transformation values based on the current angle and scale
     * which in theory reduces costly cos and sin calls
     */
    private calculateTransformation() {
        return [
            [
                this.scale * Math.cos(this.angle),
                this.scale * Math.sin(this.angle),
            ],
            [
                this.scale * Math.cos(Math.PI - this.angle),
                this.scale * Math.sin(Math.PI - this.angle),
            ],
        ];
    }
}
