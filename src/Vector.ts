import { IPoint, IVector } from './types';

export class Vector implements IVector {
    static FromTwoPoints(p1: IPoint, p2: IPoint) {
        return new Vector(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
    }

    constructor(public i: number, public j: number, public k: number) {}

    crossProduct(v2: IVector) {
        const i = this.j * v2.k - v2.j * this.k;
        const j = -1 * (this.i * v2.k - v2.i * this.k);
        const k = this.i * v2.j - v2.i * this.j;

        return new Vector(i, j, k);
    }

    dotProduct(v2: IVector) {
        return this.i * v2.i + this.j * v2.j + this.k * v2.k;
    }

    magnitude() {
        return Math.sqrt(this.i * this.i + this.j * this.j + this.k * this.k);
    }

    normalize() {
        const magnitude = this.magnitude();

        if (magnitude === 0) {
            return new Vector(0, 0, 0);
        }

        return new Vector(
            this.i / magnitude,
            this.j / magnitude,
            this.k / magnitude
        );
    }
}
