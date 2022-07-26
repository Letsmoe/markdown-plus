import { marked } from "marked";
import yaml from "js-yaml";
export default function (options) {
    const metadataRegex = /^[-]{3,}(.*?)[-]{3,}/s;
    return function (content) {
        // We need to find all the metadata, it will be in YAML format so we need to convert it to JSON.
        var metadata = content.match(metadataRegex);
        content = content.replace(metadataRegex, "");
        if (metadata) {
            metadata = yaml.load(metadata[1]);
        }
        return { content: marked.parse(content), metadata: metadata };
    };
}
