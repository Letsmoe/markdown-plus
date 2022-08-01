import { applyRef, applyState, Snowblind } from "@snowblind/core";
import { sidebarRef } from "./shared.js";

export function Header(props: any) {
	const [config, updateConfig] = applyState({});
	
	fetch("/scripts/config.json").then(response => {
		response.json().then(config => {
			updateConfig(config);
		})
	})

	var theme = localStorage.getItem("default-color-scheme") || (window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light")
	const themeRef = applyRef();
	
	document.body.classList.add(theme)
	var sidebarHidden = false;

	return () => (<div class="header">
		<div>
			<button onclick={() => {
				if (sidebarRef.current.offsetWidth > 80) {
					sidebarRef.current.style.width = "6px";
				} else {
					sidebarRef.current.style.width = "300px"
				}
				sidebarHidden = !sidebarHidden;
			}}>Hide</button>
		</div>
		<div class="link-list">
			{config.themeConfig && config.themeConfig.nav.map(item => {
				return (<a href={item.link}>{item.text}</a>)
			})}
			<span ref={themeRef} class={"theme-toggle " + theme} onclick={() => {
				let oldTheme = theme;
				theme = (theme == "light" ? "dark" : "light")
				document.body.classList.add(theme)
				document.body.classList.remove(oldTheme)

				themeRef.current.classList.add(theme)
				themeRef.current.classList.remove(oldTheme)

				localStorage.setItem("default-color-scheme", theme)
			}}></span>
		</div>
	</div>);
}