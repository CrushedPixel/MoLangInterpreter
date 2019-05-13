export default class MoLangMath {

	abs(x: number) {
		return Math.abs(x);
	}

	sin(x: number) {
		return Math.sin(x);
	}

	cos(x: number) {
		return Math.cos(x);
	}

	exp(x: number) {
		return Math.exp(x);
	}

	ln(x: number) {
		return Math.log(x);
	}

	pow(x: number, y: number) {
		return Math.pow(x, y)
	}

	sqrt(x: number) {
		return Math.sqrt(x);
	}

	random(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	ceil(x: number) {
		return Math.ceil(x);
	}

	round(x: number) {
		return Math.round(x);
	}

	trunc(x: number) {
		return Math.trunc(x);
	}

	floor(x: number) {
		return Math.floor(x);
	}

	mod(x: number, y: number) {
		return x % y;
	}

	min(x: number, y: number) {
		return Math.min(x, y);
	}

	max(x: number, y: number) {
		return Math.max(x, y);
	}

	clamp(value: number, min: number, max: number) {
		return Math.max(min, Math.min(value, max))
	}

	lerp(start: number, end: number, curve: number) {
		return start + (end - start) * curve;
	}

	lerprotate(start: number, end: number, curve: number) {
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
	}
}