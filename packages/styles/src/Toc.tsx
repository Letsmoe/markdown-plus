import { applyRef, Snowblind } from "@snowblind/core";

function getHeadingPositions() {
	return Array.from(document.querySelectorAll(".markdown-body h2, .markdown-body h3")).map(x => {
		return {
			top: x.getBoundingClientRect().top,
			element: x
		};
	});
}

export function Toc(props: any) {
	const body = document.querySelector(".markdown-body");
	const tocRef = applyRef();
	var h2Headings: any[] = [];
	if (body) {
		h2Headings = Array.from(body.querySelectorAll("h2"));
	}

	window.addEventListener("scroll", (e) => {
		const currentY = window.scrollY;
		const positions = getHeadingPositions();

		let current: Element;
		for (const {element, top} of positions) {
			if (top < 100) {
				current = element;
			}
		}
		if (current) {
			let id = current.id;
			let active = tocRef.current.querySelector(".active");
			let newActive = tocRef.current.querySelector(`[href='#${id}']`);
			if (active != newActive) {
				if (active) active.classList.remove("active");
				if (newActive) newActive.classList.add("active");
			}
		}
	})

	return () => <div class="toc" ref={tocRef}>
		<h3>On this page</h3>
		{h2Headings.map((h) => {
			const h3Headings = nextUntil(h, "h2", "h3");
			return (<div>
					<a href={"#" + h.id} class="heading">{h.textContent}</a>
					{h3Headings.map(x => {
						return <a href={"#" + x.id} class="subheading">{x.textContent}</a>
					})}
				</div>)
		})}
	</div>;
}

function nextUntil(elem: Element, selector: string, filter: string) {

	// Setup siblings array
	var siblings = [];

	// Get the next sibling element
	elem = elem.nextElementSibling;

	// As long as a sibling exists
	while (elem) {

		// If we've reached our match, bail
		if (elem.matches(selector)) break;

		// If filtering by a selector, check if the sibling matches
		if (filter && !elem.matches(filter)) {
			elem = elem.nextElementSibling;
			continue;
		}

		// Otherwise, push it to the siblings array
		siblings.push(elem);

		// Get the next sibling element
		elem = elem.nextElementSibling;

	}

	return siblings;

};