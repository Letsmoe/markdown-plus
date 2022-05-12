export default {
	css: "/docs/style/docs.css",
	"outDir": "../out/",
	"rootDir": "./",
	"resultModifier": {
		"before": (result) => {
			return result;
		}
	},
	"watch": true,
	wrapper: function(head, header, body, footer,metadata, md) {
		return `<!DOCTYPE html><html><head>${head}${this.generateMetadata(metadata)}</head><body>${header}<div class="content">${body}</div>${footer}</body></html>`
	},
	linkValidation: true
}