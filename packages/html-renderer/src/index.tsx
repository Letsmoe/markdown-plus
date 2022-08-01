/**
 * Load the default markdown into the markdown body.
 */

import { applyState, Snowblind } from "@snowblind/core";
import { Header } from "./Header.js";
import { Footer } from "./Footer.js";
import { Sidebar } from "./Sidebar.js";
import { Toc } from "./Toc.js";

window.onload = () => {
	Snowblind.render(document.body, <Header />)
	Snowblind.render(document.body, <Sidebar />)
	Snowblind.render(document.body, <Footer />)
	Snowblind.render(document.body, <Toc />)
}

