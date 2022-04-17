import * as showdown from "showdown";
import { Environment } from "../interpreter.js";
import { Config } from "./config.js";
import { env } from "./interpreter-environment.js";
//@ts-ignore
import * as mathjax from "mathjax";



// Create a function that loops through the include conditions in shared.config and test whether the given regex matches the file name
const testInclude = (file: string) => {
	for (const req of shared.config.include) {
		let reg = new RegExp(req);
		if (reg.test(file)) {
			return true;
		}
	}
	return false;
}

mathjax.init({
	loader: {load: ["input/tex", "output/svg"]}
}).then((mj : any) => {
	shared.mj = mj;
}).catch(() => console.log("Could not load MathJax..."))

const mathExtension = () => {
	return [{
		type: "lang",
		regex: /^¨D¨D(.*?)¨D¨D$/gms,
		replace: (match: string, content: string) => {
			const svg = shared.mj.tex2svg(content, {display: true});
			return shared.mj.startup.adaptor.outerHTML(svg);
		}
	}]
}
// @ts-ignore
showdown.default.extension("math", mathExtension);

const shared : {config: Config, ROOT: string, errors: number, warnings: number, converter: showdown.Converter, env: typeof Environment, mj: any} = {
	mj: undefined,
	ROOT: "",
	errors: 0,
	warnings: 0,
	// @ts-ignore
	converter: new showdown.default.Converter({
		extensions: ["math"],
		customizedHeaderId: true,
		ghCompatibleHeaderId: true,
		simplifiedAutoLink: true,
		strikethrough: true,
		tables: true,
		tasklists: true,
		emoji: true,
		completeHTMLDocument: true,
		metadata: true,
		moreStyling: true,
	}),
	env: env,
	config: {
		outDir: "",
		rootDir: "",
		watch: false,
		include: [".*"],
		exclude: [],
		css: "",
		compilerOptions: {
			outputHTML: true,
		},
		headerFile: "",
		resultModifier: {
			before: (x) => x,
			after: (x) => x
		}
	}
}

export {shared, testInclude}