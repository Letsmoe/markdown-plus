import liveServer from "live-server";
import { Context } from "./shared.js";
export function serve(root) {
    liveServer.start({
        host: "localhost",
        port: 3000,
        open: true,
        root: root,
        logLevel: 0
    });
    Context.Headers.push("Server launched successfully on http://localhost:3000");
    Context.Clear();
    Context.PrintHeaders();
}
