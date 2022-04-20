import { IPoint, ScaleBy, TranslateBy } from './types';

export class Point implements IPoint {
    static Origin() {
        return new Point(0, 0, 0);
    }

    static FromPoint(source: Point) {
        return new Point(source.x, source.y, source.z);
    }

    static FromOrigin(delta: TranslateBy) {
        const point = Point.Origin();
        point.translate(delta);
        return point;
    }

    constructor(public x: number, public y: number, public z: number) {}

    duplicate() {
        return Point.FromPoint(this);
    }

    translate(delta: TranslateBy): IPoint {
        const [x = 0, y = 0, z = 0] = delta;
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    scale(origin: IPoint, multiplier: ScaleBy) {
        let [x, y, z] = multiplier;

        this.translate([-origin.x, -origin.y, -origin.z]);

        this.x *= x;
        this.y *= y;
        this.z *= z;

        this.translate([origin.x, origin.y, origin.z]);
        return this;
    }

    rotateX(origin: IPoint, angle: number) {
        this.translate([-origin.x, -origin.y, -origin.z]);
        const z = this.z * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.z * Math.sin(angle) + this.y * Math.cos(angle);
        this.z = z;
        this.y = y;

        this.translate([origin.x, origin.y, origin.z]);
        return this;
    }

    rotateY(origin: IPoint, angle: number) {
        this.translate([-origin.x, -origin.y, -origin.z]);
        const x = this.x * Math.cos(angle) - this.z * Math.sin(angle);
        const z = this.x * Math.sin(angle) + this.z * Math.cos(angle);
        this.x = x;
        this.z = z;
        this.translate([origin.x, origin.y, origin.z]);
        return this;
    }

    rotateZ(origin: IPoint, angle: number) {
        this.translate([-origin.x, -origin.y, -origin.z]);
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        this.x = x;
        this.y = y;
        this.translate([origin.x, origin.y, origin.z]);
        return this;
    }

    depth() {
        return this.x + this.y - 2 * this.z;
    }

    distance(to: IPoint) {
        const dx = to.x - this.x;
        const dy = to.y - this.y;
        const dz = to.z - this.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}
