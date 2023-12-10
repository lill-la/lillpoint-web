export default class Id {
	private readonly value: number;

	constructor(id: number | string) {
		if (typeof id === 'number') {
			if (!Number.isInteger(id) || id < 0 || 999999 < id) throw TypeError();
			this.value = id;
		} else {
			const regexp = /^\\d{6}$/;
			if (!regexp.test(id)) throw SyntaxError('Invalid Id input string');
			this.value = parseInt(id);
		}
	}

	toNumber(): number {
		return this.value;
	}

	toString(): string {
		return this.value.toString().padStart(6, '0');
	}
}