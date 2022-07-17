export default function(document: Document) {
	let resultOutput = document.createElement('pre');
	let code = document.createElement("code");
	resultOutput.appendChild(code)
	resultOutput.style.display = "none"
	const jsCode = Array.from(document.querySelectorAll(".javascript.playground"));
	
	jsCode.forEach((block: HTMLElement) => {
		let parent = block.parentNode;
		let run = document.createElement("a");
		run.className = "playground-run";
		run.onclick = () => {
			code.innerText = ""
			const F = new Function(`with(this){${block.innerText}}`).bind({
				console: {
					log: (...args: any[]) => code.innerText += args.join(" ")
				}
			});

			code.innerText += F.call(new Proxy({}, {
				has() {return true;},
				get(target, key) {if (typeof key !== "symbol") return target[key]}
			})) || ""

			F()

			resultOutput.style.display = "block"
		}
		parent.appendChild(run);
		parent.parentNode.insertBefore(resultOutput, parent.nextSibling);
	});
}