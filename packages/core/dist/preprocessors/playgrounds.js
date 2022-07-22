export default function preprocess(options) {
    return function (content) {
        return content.replace(/\`\`\`(.*?)\n(.*?)\`\`\`/gs, (all, classes, inner) => {
            return `<pre><code class="${classes.split(",").join(" ")}">${inner}</code></pre>`;
        });
    };
}
