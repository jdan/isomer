export type TranslateBy = [number, number, number];
export type ScaleBy = [number, number, number];
export type Size = [number, number, number];
export type Position = [number, number, number];

export type Transformation = number[][];

export interface IPoint {
    x: number;
    y: number;
    z: number;
    duplicate: () => IPoint;
    translate: (delta: TranslateBy) => IPoint;
    scale: (origin: IPoint, multiplier: ScaleBy) => IPoint;
    rotateX: (origin: IPoint, angle: number) => IPoint;
    rotateY: (origin: IPoint, angle: number) => IPoint;
    rotateZ: (origin: IPoint, angle: number) => IPoint;
    depth: () => number;
    distance: (to: IPoint) => number;
}

export interface IPath {
    points: IPoint[];
    duplicate: () => IPath;
    push: (point: IPoint) => IPath;
    reverse: () => IPath;
    translate: (delta: TranslateBy) => IPath;
    scale: (origin: IPoint, multiplier: ScaleBy) => IPath;
    rotateX: (origin: IPoint, angle: number) => IPath;
    rotateY: (origin: IPoint, angle: number) => IPath;
    rotateZ: (origin: IPoint, angle: number) => IPath;
    depth: () => number;
}

export interface IShape {
    paths: IPath[];
    duplicate: () => IShape;
    clear: () => IShape;
    push: (path: IPath) => IShape;
    translate: (delta: TranslateBy) => IShape;
    scale: (origin: IPoint, multiplier: ScaleBy) => IShape;
    rotateX: (origin: IPoint, angle: number) => IShape;
    rotateY: (origin: IPoint, angle: number) => IShape;
    rotateZ: (origin: IPoint, angle: number) => IShape;
    orderPaths: () => IShape;
}

export interface IVector {
    i: number;
    j: number;
    k: number;
    magnitude: () => number;
    normalize: () => IVector;
}

export interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;
    h: number;
    s: number;
    l: number;
    duplicate: () => IColor;
    toHex: () => string;
    lighten: (percentage: number, lightColor: IColor) => IColor;
}

export interface ICanvas {
    width: number;
    height: number;
    clear: () => void;
    path: (points: IPoint[], color: IColor) => void;
}

export interface IIsomer {}

export type IsomerOptions = {
    lightPosition: IVector;
    scale: number;
    originX: number;
    originY: number;
    lightColor: IColor;
};
