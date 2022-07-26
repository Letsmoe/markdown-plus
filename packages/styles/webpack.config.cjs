const path = require('path');

module.exports = [{
	mode: "development",
	entry: "./dist/index.js",
	experiments: {
		outputModule: true
	},
	output: {
		filename: "index.dev.js",
		path: path.resolve(__dirname, 'dist'),
		library: {
			type: "module"
		}
	}
}, 
{
	mode: "production",
	entry: "./dist/index.js",
	experiments: {
		outputModule: true
	},
	output: {
		filename: "index.prod.js",
		path: path.resolve(__dirname, 'dist'),
		library: {
			type: "module"
		}
	}
}];