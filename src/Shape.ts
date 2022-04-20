import { Path } from './Path';
import { Point } from './Point';
import { IPath, IPoint, IShape, ScaleBy, Size, TranslateBy } from './types';

export class Shape implements IShape {
    public paths: IPath[];

    static Extrude(path: IPath, height: number = 1) {
        const shape = new Shape();

        let topPath = path.duplicate().translate([0, 0, height]);

        /* Push the top and bottom faces, top face must be oriented correctly */
        shape.push(path.duplicate().reverse());
        shape.push(topPath);

        for (let i = 0; i < path.points.length; i++) {
            shape.push(
                new Path([
                    topPath.points[i],
                    path.points[i],
                    path.points[(i + 1) % path.points.length],
                    topPath.points[(i + 1) % topPath.points.length],
                ])
            );
        }

        return shape;
    }

    static Prism(origin: IPoint, dimensions: Size) {
        const [dx = 1, dy = 1, dz = 1] = dimensions;
        const prism = new Shape();

        /* Squares parallel to the x-axis */
        const face1a = new Path([
            origin,
            new Point(origin.x + dx, origin.y, origin.z),
            new Point(origin.x + dx, origin.y, origin.z + dz),
            new Point(origin.x, origin.y, origin.z + dz),
        ]);

        /* Push this face and its opposite */
        prism.push(face1a);
        const face1b = face1a.duplicate().reverse().translate([0, dy, 0]);
        prism.push(face1b);

        /* Square parallel to the y-axis */
        const face2a = new Path([
            origin,
            new Point(origin.x, origin.y, origin.z + dz),
            new Point(origin.x, origin.y + dy, origin.z + dz),
            new Point(origin.x, origin.y + dy, origin.z),
        ]);
        prism.push(face2a);
        const face2b = face2a.duplicate().reverse().translate([dx, 0, 0]);
        prism.push(face2b);

        /* Square parallel to the xy-plane */
        const face3a = new Path([
            origin,
            new Point(origin.x + dx, origin.y, origin.z),
            new Point(origin.x + dx, origin.y + dy, origin.z),
            new Point(origin.x, origin.y + dy, origin.z),
        ]);
        /* This surface is oriented backwards, so we need to reverse the points */
        const face3b = face3a.duplicate().translate([0, 0, dz]);

        prism.push(face3a.reverse());
        prism.push(face3b);

        return prism;
    }

    static Pyramid(origin: IPoint, dimensions: Size) {
        const [dx = 1, dy = 1, dz = 1] = dimensions;
        const pyramid = new Shape();

        /* Path parallel to the x-axis */
        const face1a = new Path([
            origin,
            new Point(origin.x + dx, origin.y, origin.z),
            new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
        ]);
        /* Push the face, and its opposite face, by rotating around the Z-axis */
        pyramid.push(face1a);
        const face1b = face1a
            .duplicate()
            .rotateZ(
                Point.FromPoint(origin).translate([dx / 2, dy / 2, 0]),
                Math.PI
            );
        pyramid.push(face1b);

        /* Path parallel to the y-axis */
        const face2a = new Path([
            origin,
            new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
            new Point(origin.x, origin.y + dy, origin.z),
        ]);
        pyramid.push(face2a);
        const face2b = face2a
            .duplicate()
            .rotateZ(
                Point.FromPoint(origin).translate([dx / 2, dy / 2, 0]),
                Math.PI
            );
        pyramid.push(face2b);

        return pyramid;
    }

    static Cylinder(
        origin: IPoint,
        radius: number,
        vertices: number,
        height: number
    ) {
        const circle = Path.Circle(origin, radius, vertices);
        const cylinder = Shape.Extrude(circle, height);

        return cylinder;
    }

    constructor(paths: IPath[] = []) {
        this.paths = paths.map((path) => path.duplicate());
    }

    duplicate(): IShape {
        return new Shape(this.paths);
    }

    log() {
        this.paths.forEach((path, index) => {
            console.log(
                index,
                path.points.map((p) => `${p.x},${p.y},${p.z}`)
            );
        });
    }

    clear(): IShape {
        this.paths = [];
        return this;
    }

    push(path: IPath): IShape {
        this.paths.push(path);
        return this;
    }

    translate(delta: TranslateBy): IShape {
        this.paths.forEach((path) => {
            path.translate(delta);
        });
        return this;
    }

    scale(origin: IPoint, multiplier: ScaleBy): IShape {
        this.paths.forEach((path) => {
            path.scale(origin, multiplier);
        });
        return this;
    }

    rotateX(origin: IPoint, angle: number): IShape {
        this.paths.forEach((path) => {
            path.rotateX(origin, angle);
        });
        return this;
    }

    rotateY(origin: IPoint, angle: number): IShape {
        this.paths.forEach((path) => {
            path.rotateY(origin, angle);
        });
        return this;
    }

    rotateZ(origin: IPoint, angle: number): IShape {
        this.paths.forEach((path) => {
            path.rotateZ(origin, angle);
        });
        return this;
    }

    orderPaths(): IShape {
        this.paths.sort(function (pathA, pathB) {
            return pathB.depth() - pathA.depth();
        });
        return this;
    }
}
