export default class Name {
	private readonly value : string
	
	constructor(name: string) {
		const regex = /^.{0,16}$/;
		if (!regex.test(name)) throw SyntaxError();
		this.value = name;
	}
	
	toString(): string {
		return this.value;
	}
}