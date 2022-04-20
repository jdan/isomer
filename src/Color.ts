import { IColor } from './types';

export class Color implements IColor {
    public r: number;
    public g: number;
    public b: number;
    public a: number;
    public h: number;
    public s: number;
    public l: number;

    constructor(r: number, g: number, b: number, a: number = 255) {
        this.r = Math.round(r);
        this.g = Math.round(g);
        this.b = Math.round(b);
        this.a = Math.round(a);

        const hsl = this.calculateHsl();
        this.h = hsl.h;
        this.s = hsl.s;
        this.l = hsl.l;
    }

    duplicate() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    toHex(): string {
        let hex = (
            Math.floor(this.r) * 256 * 256 +
            Math.floor(this.g) * 256 +
            Math.floor(this.b)
        ).toString(16);

        if (hex.length < 6) {
            hex = new Array(6 - hex.length + 1).join('0') + hex;
        }

        return '#' + hex;
    }

    lighten(
        percentage: number,
        lightColor: IColor = new Color(255, 255, 255)
    ): IColor {
        this.r = (lightColor.r / 255) * this.r;
        this.g = (lightColor.g / 255) * this.g;
        this.b = (lightColor.b / 255) * this.b;
        this.a = (lightColor.a / 255) * this.a;

        const hsl = this.calculateHsl();
        this.h = hsl.h;
        this.s = hsl.s;
        this.l = hsl.l;

        this.l = Math.min(this.l + percentage, 1);

        const rgb = this.calculateRgb();
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        return this;
    }

    private calculateHsl() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        let h = 0,
            s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return {
            h,
            s,
            l,
        };
    }

    private calculateRgb() {
        let r, g, b;
        const h = this.h;
        const s = this.s;
        const l = this.l;

        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = this.hue2rgb(p, q, h + 1 / 3);
            g = this.hue2rgb(p, q, h);
            b = this.hue2rgb(p, q, h - 1 / 3);
        }

        r *= 255;
        g *= 255;
        b *= 255;

        return {
            r,
            g,
            b,
        };
    }

    private hue2rgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

        return p;
    }
}
