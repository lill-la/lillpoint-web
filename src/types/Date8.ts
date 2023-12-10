export default class Date8 {
	private readonly value: Date;

	constructor(first: string | Date) {
		if (typeof first === 'string') {
			const regex = /^[0-9]{8}$/;
			if (!regex.test(first)) throw SyntaxError();
			const date = new Date();
			date.setFullYear(parseInt(first.substring(0, 4)));
			date.setMonth(parseInt(first.substring(4, 6)));
			date.setDate(parseInt(first.substring(6, 8)));
			this.value = date;
		} else {
			this.value = first;
		}
	}

	toString(): string {
		return this.value.getFullYear().toString()
			+ this.value.getMonth().toString().padStart(2, '0')
			+ this.value.getDate().toString().padStart(2, '0');
	}
}