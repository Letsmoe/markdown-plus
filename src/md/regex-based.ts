interface Rule {
	token: RegExp | string,
	transform: (all : string, ...args: string[]) => string,
}

class Tokenizer {
	private rules = [];
	public output : string = "";
	constructor(private input: string) {
		this.input = input.trim();
		this.addRule([
			{
				token: /^(#{1,6}) (.*)/gm,
				transform: (all : string, hashes : string, text: string) => {
					let level = hashes.length;
					return `<h${level}>${text}</h${level}>`;
				},
			}, {
				token: /^```(.*?)\n(.*?)```/gsm,
				transform: (all : string, language : string, code: string) => {
					return `<pre><code class="language-${language}">${code}</code></pre>`;
				}
			},
			{
				token: /^\[(.*?)\]\((.*?)\)/gm,
				transform: (all : string, text: string, url: string) => {
					return `<a href="${url}">${text}</a>`;
				},
			},
			{
				token: /^\*\*(.*?)\*\*/gm,
				transform: (all : string, text: string) => {
					return `<strong>${text}</strong>`;
				},
			},
			{
				token: /^\*(.*?)\*/gm,
				transform: (all : string, text: string) => {
					return `<em>${text}</em>`;
				},
			},
			{
				token: /^!\[(.*?)\]\((.*?)\)/gm,
				transform: (all : string, alt: string, url: string) => {
					return `<img src="${url}" alt="${alt}"></img>`;
				},
			},
			// Match an inline code block
			{
				token: /^`(.*?)`/gm,
				transform: (all : string, code: string) => {
					return `<code>${code}</code>`;
				},
			},
			// Match a blockquote
			{
				token: /^> (.*)/gm,
				transform: (all : string, text: string) => {
					return `<blockquote>${text}</blockquote>`;
				},
			},
			// Match a list 
			{
				token: /^(\*|\d+\.|\-) (.*)/gm,
				transform: (all : string, bullet: string, text: string) => {
					let type = bullet.match(/^\d+\./) ? "ol" : "ul";
					return `<${type}><li>${text}</li></${type}>`;
				},
			},
		])
		this._start()
	};

	private _start() {
		for (const rule of this.rules) {
			this.applyRule(rule);
		}
	}

	public applyRule(rule: Rule): void {
		let regexp = new RegExp(rule.token);
		let matchArray = this.input.matchAll(regexp);
		for (const match of matchArray) {
			let [all, ...args] = match;
			this.output += rule.transform(all, ...args);
		}
	}

	public addRule(rule: Rule | Rule[]): void {
		let rules = [rule].flat(Infinity);
		this.rules = this.rules.concat(rules);
	}
}

export {Tokenizer}