let mainNode = document.querySelector(".tree-view");

function makeTree(object, lastElement = mainNode, indent = 0) {
	const parentNode = lastElement;
	for (const key in object) {
		let value = object[key];

		if (value instanceof Object) {
			let div = _("div", {}, {style: {marginLeft: "15px"}});
			let keyNode = _("span", {class: "tree-key"}, {innerText: key});
			div.appendChild(keyNode)
			parentNode.appendChild(div)
			lastElement = div;
			makeTree(value, lastElement, indent + 1);
		} else {
			let div = _("div", {}, {style: {marginLeft: "15px"}});
			let keyNode = _("span", {class: "tree-key"}, {innerText: key});
			let valueNode = _("span", {class: "tree-value"}, {innerText: value});
			div.appendChild(keyNode)
			div.appendChild(valueNode)
			parentNode.appendChild(div);
			lastElement = div
		}
	}
}

function _(type = "div", attributes = {}, properties = {}) {
	let el = document.createElement(type);

	for (const key in attributes) {
		let val = attributes[key];
		el.setAttribute(key, val);
	}

	const addProperty = (prop, value) => {
		if (typeof value === "object") {
			for (const key in value) {
				let val = value[key];
				if (typeof val === "object") {
					addProperty(prop[key], val)
				} else {
					prop[key] = val
				}
			}
		}
	}

	addProperty(el, properties)
	

	return el
}