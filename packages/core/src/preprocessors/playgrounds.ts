import { BackendFunction } from "../config.type.js"

export default function preprocess(options: any): BackendFunction {
	return function(content: string): string {
		return content.replace(/\`\`\`(.*?)\n(.*?)\`\`\`/gs, (all, classes, inner) => {
			return `<pre><code class="${classes.split(",").join(" ")}">${inner}</code></pre>`
		})
	}
}