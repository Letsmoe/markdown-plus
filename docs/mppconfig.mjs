export default {
	"rootDir": "./",
	"outDir": "./dist/",
	"css": "/style/github-markdown.css",
	"compilerOptions": {
		"verbose": 1
	},
	"watch": true,
	"resultModifier": {
		"before": (content) => {
			return content;
		}
	}
}