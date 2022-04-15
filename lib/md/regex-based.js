class Tokenizer {
    constructor(input) {
        this.input = input;
        this.rules = [];
        this.output = "";
        this.input = input.trim();
        this.addRule([
            {
                token: /^(#{1,6}) (.*)/gm,
                transform: (all, hashes, text) => {
                    let level = hashes.length;
                    return `<h${level}>${text}</h${level}>`;
                },
            }, {
                token: /^```(.*?)\n(.*?)```/gsm,
                transform: (all, language, code) => {
                    return `<pre><code class="language-${language}">${code}</code></pre>`;
                }
            },
            {
                token: /^\[(.*?)\]\((.*?)\)/gm,
                transform: (all, text, url) => {
                    return `<a href="${url}">${text}</a>`;
                },
            },
            {
                token: /^\*\*(.*?)\*\*/gm,
                transform: (all, text) => {
                    return `<strong>${text}</strong>`;
                },
            },
            {
                token: /^\*(.*?)\*/gm,
                transform: (all, text) => {
                    return `<em>${text}</em>`;
                },
            },
            {
                token: /^!\[(.*?)\]\((.*?)\)/gm,
                transform: (all, alt, url) => {
                    return `<img src="${url}" alt="${alt}"></img>`;
                },
            },
            // Match an inline code block
            {
                token: /^`(.*?)`/gm,
                transform: (all, code) => {
                    return `<code>${code}</code>`;
                },
            },
            // Match a blockquote
            {
                token: /^> (.*)/gm,
                transform: (all, text) => {
                    return `<blockquote>${text}</blockquote>`;
                },
            },
            // Match a list 
            {
                token: /^(\*|\d+\.|\-) (.*)/gm,
                transform: (all, bullet, text) => {
                    let type = bullet.match(/^\d+\./) ? "ol" : "ul";
                    return `<${type}><li>${text}</li></${type}>`;
                },
            },
        ]);
        this._start();
    }
    ;
    _start() {
        for (const rule of this.rules) {
            this.applyRule(rule);
        }
    }
    applyRule(rule) {
        let regexp = new RegExp(rule.token);
        let matchArray = this.input.matchAll(regexp);
        for (const match of matchArray) {
            let [all, ...args] = match;
            this.output += rule.transform(all, ...args);
        }
    }
    addRule(rule) {
        let rules = [rule].flat(Infinity);
        this.rules = this.rules.concat(rules);
    }
}
export { Tokenizer };
