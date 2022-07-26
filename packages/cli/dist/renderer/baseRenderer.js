import * as fs from 'fs';
import * as path from 'path';
import __dirname from "../__dirname.js";
export default function (options, out) {
    /**
     * We want to create some default directories.
     * First create a style and a scripts folder.
     */
    const dirStyle = path.join(out, "style");
    const dirScript = path.join(out, "scripts");
    if (!fs.existsSync(dirStyle)) {
        fs.mkdirSync(dirStyle);
    }
    if (!fs.existsSync(dirScript)) {
        fs.mkdirSync(dirScript);
    }
    /**
     * Move the main style into the style folder.
     */
    fs.copyFileSync(path.join(__dirname, "../includes/style.css"), path.join(dirStyle, "style.css"));
    /**
     * Move the main js file that will generate our sidebar into the scripts folder.
     */
    fs.copyFileSync(path.join(__dirname, "./content/main.js"), path.join(dirScript, "index.js"));
    return function (content, metadata) {
        var metaString = "";
        for (const key in metadata) {
            const value = metadata[key];
            if (key == "title") {
                metaString += `<title>${value}</title>`;
            }
            else if (key == "styles") {
                value.map(x => metaString += `<link rel="stylesheet" href="${x}" />`);
            }
            else {
                metaString += `<meta name="${key}" content="${value}"></meta>`;
            }
        }
        const head = `<head>
			${metaString}
			<link rel="stylesheet" href="/style/style.css">
			<script type="module">
				import summary from "/scripts/summary.js";
				document.querySelector(".sidebar").innerHTML = summary;
				let current = document.querySelector(".sidebar").querySelector(\`a[href='\${window.location.pathname}']\`);
				console.log(current, document.querySelector(".sidebar").innerHTML);
				
				if (current) {
					current.classList.add("active")
				}
			</script>
		</head>`;
        const body = `<body>
			<div class="sidebar"></div>
			<div class="inner-body">${content}</div>	
			<div class="toc">
				<div class="scrolling-sidebar" id="heading-sidebar"><h3>In this article</h3></div>
			</div>
		</body>
		<script src="/scripts/index.js"></script>`;
        return `<!DOCTYPE html><html>${head}${body}</html>`;
    };
}
