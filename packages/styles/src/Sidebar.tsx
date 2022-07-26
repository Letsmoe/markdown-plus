import { applyRef, Snowblind } from "@snowblind/core";
import { sidebarRef } from "./shared.js";

export function Sidebar(props: any) {
	const dragRef = applyRef()

	fetch("/assets/summary.html").then(response => {
		response.text().then(responseText => {
			let template = document.createElement("template");
			template.innerHTML = responseText;
			for (const child of Array.from(template.content.childNodes)) {
				sidebarRef.current.appendChild(child)
			}
		})
	})

	return () => (<div class="sidebar" ref={sidebarRef}>
		<div class="resize-handle" onmousedown={(downEvent) => {
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none"
			let startX = downEvent.clientX;
			let startWidth = sidebarRef.current.offsetWidth
			const mousemove = (e) => {
				let endX = e.clientX
				let diff = startX - endX;
				let endWidth = startWidth - diff;
				
				if (endWidth < 600) {
					sidebarRef.current.style.width = endWidth + "px";
				}

				if (endWidth < 80) {
					sidebarRef.current.style.width = 6 + "px";
				}
			};

			window.addEventListener("mousemove", mousemove)

			const mouseup = () => {
				document.body.style.cursor = "auto";
				document.body.style.userSelect = ""
				window.removeEventListener("mouseup", mouseup)
				window.removeEventListener("mousemove", mousemove)
			};
			window.addEventListener("mouseup", mouseup)
		}} ref={dragRef}></div>
	</div>);
}