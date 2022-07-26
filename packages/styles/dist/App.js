import { Snowblind } from "@snowblind/core";
import { Header } from "./Header.js";
import { Footer } from "./Footer.js";
import { Content } from "./Content.js";
import { Sidebar } from "./Sidebar.js";
import { Toc } from "./Toc.js";
function App(props) {
    return () => (Snowblind.make("div", { class: "markdown" },
        Snowblind.make(Header, null),
        Snowblind.make(Sidebar, null),
        Snowblind.make(Content, null),
        Snowblind.make(Toc, null),
        Snowblind.make(Footer, null)));
}
export { App };
//# sourceMappingURL=App.js.map