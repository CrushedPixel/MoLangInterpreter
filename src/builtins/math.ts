import {FunctionVariable, ReadonlyObjectVariable} from "../variables";

export default class MoLangMath extends ReadonlyObjectVariable {

	constructor() {
		super({
			abs: new FunctionVariable((x: number) => {
				return Math.abs(x);
			}),

			sin: new FunctionVariable((x: number) => {
				return Math.sin(x);
			}),

			cos: new FunctionVariable((x: number) => {
				return Math.cos(x);
			}),

			exp: new FunctionVariable((x: number) => {
				return Math.exp(x);
			}),

			ln: new FunctionVariable((x: number) => {
				return Math.log(x);
			}),

			pow: new FunctionVariable((x: number, y: number) => {
				return Math.pow(x, y);
			}),

			sqrt: new FunctionVariable((x: number) => {
				return Math.sqrt(x);
			}),

			random: new FunctionVariable((min: number, max: number) => {
				return min + Math.random() * (max - min);
			}),

			ceil: new FunctionVariable((x: number) => {
				return Math.ceil(x);
			}),

			round: new FunctionVariable((x: number) => {
				return Math.round(x);
			}),

			trunc: new FunctionVariable((x: number) => {
				return Math.trunc(x);
			}),

			floor: new FunctionVariable((x: number) => {
				return Math.floor(x);
			}),

			mod: new FunctionVariable((x: number, y: number) => {
				return x % y;
			}),

			min: new FunctionVariable((x: number, y: number) => {
				return Math.min(x, y);
			}),

			max: new FunctionVariable((x: number, y: number) => {
				return Math.max(x, y);
			}),

			clamp: new FunctionVariable((value: number, min: number, max: number) => {
				return Math.max(min, Math.min(value, max));
			}),

			lerp: new FunctionVariable((start: number, end: number, curve: number) => {
				return start + (end - start) * curve;
			}),

			lerprotate: new FunctionVariable((start: number, end: number, curve: number) => {
				const radify = n => (((n + 180) % 360) + 180) % 360;

				let a = radify(start);
				let b = radify(end);
				const i = curve;

				if (a > b) [a, b] = [b, a];
				const diff = b - a;
				if (diff > 180) {
					return radify(b + i * (360 - diff));
				} else {
					return a + i * diff;
				}
			}),
		})
	}
}