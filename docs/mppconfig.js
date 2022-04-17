export default {
	"rootDir": "./",
	"outDir": "../out/",
	"css": "/out/style/github-markdown.css",
	"compilerOptions": {
		"verbose": 1
	},
	"watch": true,
	"headerFile": "./includes/header.html",
	"resultModifier": {
		"before": (content) => {
			return content;
		}
	}
}