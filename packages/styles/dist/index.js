/**
 * Load the default markdown into the markdown body.
 */
import { Snowblind } from "@snowblind/core";
import { Header } from "./Header.js";
import { Footer } from "./Footer.js";
import { Sidebar } from "./Sidebar.js";
import { Toc } from "./Toc.js";
window.onload = () => {
    Snowblind.render(document.body, Snowblind.make(Header, null));
    Snowblind.render(document.body, Snowblind.make(Sidebar, null));
    Snowblind.render(document.body, Snowblind.make(Footer, null));
    Snowblind.render(document.body, Snowblind.make(Toc, null));
};
//# sourceMappingURL=index.js.map